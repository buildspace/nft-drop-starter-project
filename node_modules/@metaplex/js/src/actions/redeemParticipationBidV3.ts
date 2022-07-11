import BN from 'bn.js';
import { PublicKey, TransactionSignature } from '@solana/web3.js';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
import { sendTransaction } from './transactions';
import { TransactionsBatch } from '../utils/transactions-batch';
import { createApproveTxs, createWrappedAccountTxs, prepareTokenAccountAndMintTxs } from './shared';
import { getBidRedemptionPDA } from './redeemFullRightsTransferBid';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Auction, AuctionExtended, BidderMetadata } from '@metaplex-foundation/mpl-auction';
import { Vault } from '@metaplex-foundation/mpl-token-vault';
import {
  AuctionManager,
  NonWinningConstraint,
  ParticipationConfigV2,
  PrizeTrackingTicket,
  RedeemParticipationBidV3,
  SafetyDepositConfig,
  WinningConstraint,
} from '@metaplex-foundation/mpl-metaplex';
import {
  Edition,
  EditionMarker,
  MasterEdition,
  Metadata,
  UpdatePrimarySaleHappenedViaToken,
} from '@metaplex-foundation/mpl-token-metadata';

interface IRedeemParticipationBidV3Params {
  connection: Connection;
  wallet: Wallet;
  auction: PublicKey;
  store: PublicKey;
}

interface IRedeemParticipationBidV3Response {
  txIds: TransactionSignature[];
}

export const redeemParticipationBidV3 = async ({
  connection,
  wallet,
  store,
  auction,
}: IRedeemParticipationBidV3Params): Promise<IRedeemParticipationBidV3Response> => {
  const txInitBatch = new TransactionsBatch({ transactions: [] });
  const txMainBatch = new TransactionsBatch({ transactions: [] });

  const bidder = wallet.publicKey;
  const {
    data: { bidState, tokenMint: auctionTokenMint },
  } = await Auction.load(connection, auction);
  const auctionManagerPDA = await AuctionManager.getPDA(auction);
  const manager = await AuctionManager.load(connection, auctionManagerPDA);
  const vault = await Vault.load(connection, manager.data.vault);
  const auctionExtendedPDA = await AuctionExtended.getPDA(vault.pubkey);
  const [safetyDepositBox] = await vault.getSafetyDepositBoxes(connection);
  const originalMint = new PublicKey(safetyDepositBox.data.tokenMint);

  const safetyDepositTokenStore = new PublicKey(safetyDepositBox.data.store);
  const bidderMetaPDA = await BidderMetadata.getPDA(auction, bidder);
  const bidRedemptionPDA = await getBidRedemptionPDA(auction, bidderMetaPDA);
  const safetyDepositConfigPDA = await SafetyDepositConfig.getPDA(
    auctionManagerPDA,
    safetyDepositBox.pubkey,
  );
  const {
    data: {
      participationConfig: { fixedPrice },
    },
  } = await SafetyDepositConfig.load(connection, safetyDepositConfigPDA);
  const acceptPaymentAccount = new PublicKey(manager.data.acceptPayment);

  const { mint, createMintTx, createAssociatedTokenAccountTx, mintToTx, recipient } =
    await prepareTokenAccountAndMintTxs(connection, wallet.publicKey);

  txInitBatch.addSigner(mint);
  txInitBatch.addTransaction(createMintTx);
  txInitBatch.addTransaction(createAssociatedTokenAccountTx);
  txInitBatch.addTransaction(mintToTx);

  const newMint = mint.publicKey;
  const newMetadataPDA = await Metadata.getPDA(newMint);
  const newEditionPDA = await Edition.getPDA(newMint);

  const metadataPDA = await Metadata.getPDA(originalMint);
  const masterEditionPDA = await MasterEdition.getPDA(originalMint);
  const masterEdition = await MasterEdition.load(connection, masterEditionPDA);

  const prizeTrackingTicketPDA = await PrizeTrackingTicket.getPDA(auctionManagerPDA, originalMint);
  const winIndex = bidState.getWinnerIndex(bidder.toBase58());

  const desiredEdition = masterEdition.data.supply.add(new BN(1));
  const editionMarkerPDA = await EditionMarker.getPDA(originalMint, desiredEdition);

  let tokenPaymentAccount: PublicKey;
  if (auctionTokenMint === NATIVE_MINT.toBase58()) {
    const { account, createTokenAccountTx, closeTokenAccountTx } = await createWrappedAccountTxs(
      connection,
      bidder,
      fixedPrice.toNumber(),
    );
    tokenPaymentAccount = account.publicKey;
    txInitBatch.addTransaction(createTokenAccountTx);
    txInitBatch.addSigner(account);
    txMainBatch.addAfterTransaction(closeTokenAccountTx);
  } else {
    // TODO: find out what will happen if currency is not WSOL
    tokenPaymentAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(auctionTokenMint),
      bidder,
    );
  }

  const { authority, createApproveTx, createRevokeTx } = createApproveTxs({
    account: tokenPaymentAccount,
    owner: bidder,
    amount: fixedPrice.toNumber(),
  });
  txMainBatch.addTransaction(createApproveTx);
  txMainBatch.addAfterTransaction(createRevokeTx);
  txMainBatch.addSigner(authority);

  const redeemParticipationBidV3Tx = new RedeemParticipationBidV3(
    { feePayer: bidder },
    {
      store,
      vault: vault.pubkey,
      auction,
      auctionManager: auctionManagerPDA,
      bidRedemption: bidRedemptionPDA,
      bidMetadata: bidderMetaPDA,
      safetyDepositTokenStore,
      destination: recipient,
      safetyDeposit: safetyDepositBox.pubkey,
      bidder,
      safetyDepositConfig: safetyDepositConfigPDA,
      auctionExtended: auctionExtendedPDA,
      newMint,
      newEdition: newEditionPDA,
      newMetadata: newMetadataPDA,
      metadata: metadataPDA,
      masterEdition: masterEditionPDA,
      editionMark: editionMarkerPDA,
      prizeTrackingTicket: prizeTrackingTicketPDA,
      winIndex: winIndex !== null ? new BN(winIndex) : null,
      transferAuthority: authority.publicKey,
      tokenPaymentAccount,
      acceptPaymentAccount,
    },
  );
  txMainBatch.addTransaction(redeemParticipationBidV3Tx);

  const updatePrimarySaleHappenedViaTokenTx = new UpdatePrimarySaleHappenedViaToken(
    { feePayer: bidder },
    {
      metadata: newMetadataPDA,
      owner: bidder,
      tokenAccount: recipient,
    },
  );
  txMainBatch.addTransaction(updatePrimarySaleHappenedViaTokenTx);

  const initTxId = await sendTransaction({
    connection,
    wallet,
    txs: txInitBatch.toTransactions(),
    signers: txInitBatch.signers,
  });

  // wait for all accounts to be created
  await connection.confirmTransaction(initTxId, 'finalized');

  const mainTxId = await sendTransaction({
    connection,
    wallet,
    txs: txMainBatch.toTransactions(),
    signers: txMainBatch.signers,
  });

  return { txIds: [initTxId, mainTxId] };
};

export function isEligibleForParticipationPrize(
  winIndex: number,
  { nonWinningConstraint, winnerConstraint }: ParticipationConfigV2 = {} as ParticipationConfigV2,
) {
  const noWinnerConstraints = winnerConstraint !== WinningConstraint.NoParticipationPrize;
  const noNonWinnerConstraints = nonWinningConstraint !== NonWinningConstraint.NoParticipationPrize;
  return (
    (winIndex === null && noNonWinnerConstraints) || (winIndex !== null && noWinnerConstraints)
  );
}
