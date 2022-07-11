import { PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
import { TransactionsBatch } from '../utils/transactions-batch';
interface IClaimBidParams {
    connection: Connection;
    wallet: Wallet;
    auction: PublicKey;
    store: PublicKey;
    bidderPotToken: PublicKey;
}
interface IClaimBidResponse {
    txId: string;
}
export declare const claimBid: ({ connection, wallet, store, auction, bidderPotToken, }: IClaimBidParams) => Promise<IClaimBidResponse>;
interface IClaimBidTransactionsParams {
    bidder: PublicKey;
    bidderPotToken?: PublicKey;
    bidderPot: PublicKey;
    auction: PublicKey;
    auctionExtended: PublicKey;
    auctionTokenMint: PublicKey;
    vault: PublicKey;
    store: PublicKey;
    auctionManager: PublicKey;
    acceptPayment: PublicKey;
}
export declare const getClaimBidTransactions: ({ bidder, auctionTokenMint, store, vault, auction, auctionManager, auctionExtended, acceptPayment, bidderPot, bidderPotToken, }: IClaimBidTransactionsParams) => Promise<TransactionsBatch>;
export {};
