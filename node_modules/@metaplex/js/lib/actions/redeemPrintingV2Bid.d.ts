import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
import { TransactionsBatch } from '../utils/transactions-batch';
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
export declare const redeemPrintingV2Bid: ({ connection, wallet, store, auction, }: IRedeemBidParams) => Promise<IRedeemBidResponse>;
export declare const getRedeemPrintingV2BidTransactions: ({ bidder, destination, store, vault, auction, auctionManager, auctionExtended, bidRedemption, bidderMeta: bidMetadata, safetyDepositTokenStore, safetyDeposit, safetyDepositConfig, metadata, newMint, newMetadata, newEdition, masterEdition, editionMarker: editionMark, prizeTrackingTicket, winIndex, editionOffset, }: IRedeemBidTransactionsParams) => Promise<TransactionsBatch>;
export declare function getEditionOffset(winIndex: number): BN;
export {};
