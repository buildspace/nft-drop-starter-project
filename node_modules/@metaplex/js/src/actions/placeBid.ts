import BN from 'bn.js';
import { Commitment, Keypair, PublicKey, TransactionSignature } from '@solana/web3.js';
import { AccountLayout } from '@solana/spl-token';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
import { sendTransaction } from './transactions';
import {
  AuctionExtended,
  BidderMetadata,
  BidderPot,
  PlaceBid,
} from '@metaplex-foundation/mpl-auction';
import { AuctionManager } from '@metaplex-foundation/mpl-metaplex';
import { TransactionsBatch } from '../utils/transactions-batch';
import { getCancelBidTransactions } from './cancelBid';
import { CreateTokenAccount } from '../transactions';
import { createApproveTxs, createWrappedAccountTxs } from './shared';

interface IPlaceBidParams {
  connection: Connection;
  wallet: Wallet;
  auction: PublicKey;
  bidderPotToken?: PublicKey;
  // amount in lamports
  amount: BN;
  commitment?: Commitment;
}

interface IPlaceBidResponse {
  txId: TransactionSignature;
  bidderPotToken: PublicKey;
  bidderMeta: PublicKey;
}

export const placeBid = async ({
  connection,
  wallet,
  amount,
  auction,
  bidderPotToken,
}: IPlaceBidParams): Promise<IPlaceBidResponse> => {
  // get data for transactions
  const bidder = wallet.publicKey;
  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(AccountLayout.span);
  const auctionManager = await AuctionManager.getPDA(auction);
  const manager = await AuctionManager.load(connection, auctionManager);
  const {
    data: { tokenMint },
  } = await manager.getAuction(connection);
  const auctionTokenMint = new PublicKey(tokenMint);
  const vault = new PublicKey(manager.data.vault);
  const auctionExtended = await AuctionExtended.getPDA(vault);
  const bidderPot = await BidderPot.getPDA(auction, bidder);
  const bidderMeta = await BidderMetadata.getPDA(auction, bidder);
  ////

  let txBatch = new TransactionsBatch({ transactions: [] });

  if (bidderPotToken) {
    // cancel prev bid
    txBatch = await getCancelBidTransactions({
      destAccount: null,
      bidder,
      accountRentExempt,
      bidderPot,
      bidderPotToken,
      bidderMeta,
      auction,
      auctionExtended,
      auctionTokenMint,
      vault,
    });
    ////
  } else {
    // create a new account for bid
    const account = Keypair.generate();
    const createBidderPotTransaction = new CreateTokenAccount(
      { feePayer: bidder },
      {
        newAccountPubkey: account.publicKey,
        lamports: accountRentExempt,
        mint: auctionTokenMint,
        owner: auction,
      },
    );
    txBatch.addSigner(account);
    txBatch.addTransaction(createBidderPotTransaction);
    bidderPotToken = account.publicKey;
    ////
  }

  // create paying account
  const {
    account: payingAccount,
    createTokenAccountTx,
    closeTokenAccountTx,
  } = await createWrappedAccountTxs(connection, bidder, amount.toNumber() + accountRentExempt * 2);
  txBatch.addTransaction(createTokenAccountTx);
  txBatch.addAfterTransaction(closeTokenAccountTx);
  txBatch.addSigner(payingAccount);
  ////

  // transfer authority
  const {
    authority: transferAuthority,
    createApproveTx,
    createRevokeTx,
  } = createApproveTxs({
    account: payingAccount.publicKey,
    owner: bidder,
    amount: amount.toNumber(),
  });
  txBatch.addTransaction(createApproveTx);
  txBatch.addAfterTransaction(createRevokeTx);
  txBatch.addSigner(transferAuthority);
  ////

  // create place bid transaction
  const placeBidTransaction = new PlaceBid(
    { feePayer: bidder },
    {
      bidder,
      bidderToken: payingAccount.publicKey,
      bidderPot,
      bidderPotToken,
      bidderMeta,
      auction,
      auctionExtended,
      tokenMint: auctionTokenMint,
      transferAuthority: transferAuthority.publicKey,
      amount,
      resource: vault,
    },
  );
  txBatch.addTransaction(placeBidTransaction);
  ////

  const txId = await sendTransaction({
    connection,
    wallet,
    txs: txBatch.toTransactions(),
    signers: txBatch.signers,
  });

  return { txId, bidderPotToken, bidderMeta };
};
