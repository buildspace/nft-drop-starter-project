import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
import { sendTransaction } from './transactions';
import { Auction, AuctionExtended, BidderMetadata } from '@metaplex-foundation/mpl-auction';
import { TransactionsBatch } from '../utils/transactions-batch';
import {
  AuctionManager,
  PrizeTrackingTicket,
  SafetyDepositConfig,
} from '@metaplex-foundation/mpl-metaplex';
import { Vault } from '@metaplex-foundation/mpl-token-vault';
import {
  Edition,
  EditionMarker,
  MasterEdition,
  Metadata,
  UpdatePrimarySaleHappenedViaToken,
} from '@metaplex-foundation/mpl-token-metadata';
import { RedeemPrintingV2Bid } from '@metaplex-foundation/mpl-metaplex';
import { prepareTokenAccountAndMintTxs } from './shared';
import { getBidRedemptionPDA } from './redeemFullRightsTransferBid';

interface IRedeemBidParams {
  connection: Connection;
  wallet: Wallet;
  auction: PublicKey;
  store: PublicKey;
}

interface IRedeemBidResponse {
  txId: string;
}

interface IRedeemBidTransactionsParams {
  bidder: PublicKey;
  bidderPotToken?: PublicKey;
  bidderMeta: PublicKey;
  auction: PublicKey;
  auctionExtended: PublicKey;
  destination: PublicKey;
  vault: PublicKey;
  store: PublicKey;
  auctionManager: PublicKey;
  bidRedemption: PublicKey;
  safetyDepositTokenStore: PublicKey;
  safetyDeposit: PublicKey;
  safetyDepositConfig: PublicKey;
  metadata: PublicKey;
  newMint: PublicKey;
  newMetadata: PublicKey;
  newEdition: PublicKey;
  masterEdition: PublicKey;
  editionMarker: PublicKey;
  prizeTrackingTicket: PublicKey;
  winIndex: BN;
  editionOffset: BN;
}

export const redeemPrintingV2Bid = async ({
  connection,
  wallet,
  store,
  auction,
}: IRedeemBidParams): Promise<IRedeemBidResponse> => {
  const bidder = wallet.publicKey;
  const {
    data: { bidState },
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

  const { mint, createMintTx, createAssociatedTokenAccountTx, mintToTx, recipient } =
    await prepareTokenAccountAndMintTxs(connection, wallet.publicKey);

  const newMint = mint.publicKey;
  const newMetadataPDA = await Metadata.getPDA(newMint);
  const newEditionPDA = await Edition.getPDA(newMint);

  const metadataPDA = await Metadata.getPDA(originalMint);
  const masterEditionPDA = await MasterEdition.getPDA(originalMint);
  const masterEdition = await MasterEdition.load(connection, masterEditionPDA);

  const prizeTrackingTicketPDA = await PrizeTrackingTicket.getPDA(auctionManagerPDA, originalMint);

  let prizeTrackingTicket: PrizeTrackingTicket;
  // this account doesn't exist when we do redeem for the first time
  try {
    prizeTrackingTicket = await PrizeTrackingTicket.load(connection, prizeTrackingTicketPDA);
  } catch (e) {
    prizeTrackingTicket = null;
  }

  const winIndex = bidState.getWinnerIndex(bidder.toBase58()) || 0;

  const editionOffset = getEditionOffset(winIndex);
  const editionBase = prizeTrackingTicket?.data.supplySnapshot || masterEdition.data.supply;
  const desiredEdition = editionBase.add(editionOffset);
  const editionMarkerPDA = await EditionMarker.getPDA(originalMint, desiredEdition);

  // checking if edition marker is taken
  try {
    const editionMarker = await EditionMarker.load(connection, editionMarkerPDA);
    const isEditionTaken = editionMarker.data.editionTaken(desiredEdition.toNumber());
    if (isEditionTaken) {
      throw new Error('The edition is already taken');
    }
  } catch (e) {
    // it's not. continue
  }

  const txBatch = await getRedeemPrintingV2BidTransactions({
    bidder,
    bidderMeta: bidderMetaPDA,
    store,
    vault: vault.pubkey,
    destination: recipient,
    auction,
    auctionExtended: auctionExtendedPDA,
    auctionManager: auctionManagerPDA,
    safetyDepositTokenStore,
    safetyDeposit: safetyDepositBox.pubkey,
    bidRedemption: bidRedemptionPDA,
    safetyDepositConfig: safetyDepositConfigPDA,

    metadata: metadataPDA,
    newMint,
    newMetadata: newMetadataPDA,
    newEdition: newEditionPDA,
    masterEdition: masterEditionPDA,
    editionMarker: editionMarkerPDA,
    prizeTrackingTicket: prizeTrackingTicketPDA,
    editionOffset,
    winIndex: new BN(winIndex),
  });

  txBatch.addSigner(mint);
  txBatch.addBeforeTransaction(createMintTx);
  txBatch.addBeforeTransaction(createAssociatedTokenAccountTx);
  txBatch.addBeforeTransaction(mintToTx);

  const txId = await sendTransaction({
    connection,
    wallet,
    txs: txBatch.toTransactions(),
    signers: txBatch.signers,
  });

  return { txId };
};

export const getRedeemPrintingV2BidTransactions = async ({
  bidder,
  destination,
  store,
  vault,
  auction,
  auctionManager,
  auctionExtended,
  bidRedemption,
  bidderMeta: bidMetadata,
  safetyDepositTokenStore,
  safetyDeposit,
  safetyDepositConfig,

  metadata,
  newMint,
  newMetadata,
  newEdition,
  masterEdition,
  editionMarker: editionMark,
  prizeTrackingTicket,

  winIndex,
  editionOffset,
}: IRedeemBidTransactionsParams) => {
  const txBatch = new TransactionsBatch({ transactions: [] });

  const redeemPrintingV2BidTx = new RedeemPrintingV2Bid(
    { feePayer: bidder },
    {
      store,
      vault,
      auction,
      auctionManager,
      bidRedemption,
      bidMetadata,
      safetyDepositTokenStore,
      destination,
      safetyDeposit,
      bidder,
      safetyDepositConfig,
      auctionExtended,

      newMint,
      newEdition,
      newMetadata,
      metadata,
      masterEdition,
      editionMark,
      prizeTrackingTicket,
      winIndex,
      editionOffset,
    },
  );
  txBatch.addTransaction(redeemPrintingV2BidTx);

  const updatePrimarySaleHappenedViaTokenTx = new UpdatePrimarySaleHappenedViaToken(
    { feePayer: bidder },
    {
      metadata: newMetadata,
      owner: bidder,
      tokenAccount: destination,
    },
  );
  txBatch.addTransaction(updatePrimarySaleHappenedViaTokenTx);

  return txBatch;
};

export function getEditionOffset(winIndex: number) {
  const offset = new BN(1);
  // NOTE: not sure if this the right way to calculate it
  return offset.add(new BN(winIndex));
}
