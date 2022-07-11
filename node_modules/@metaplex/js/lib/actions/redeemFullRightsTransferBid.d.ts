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
export declare const redeemFullRightsTransferBid: ({ connection, wallet, store, auction, }: IRedeemBidParams) => Promise<IRedeemBidResponse>;
interface IRedeemBidTransactionsParams {
    bidder: PublicKey;
    accountRentExempt: number;
    bidderPotToken?: PublicKey;
    bidderMeta: PublicKey;
    auction: PublicKey;
    auctionExtended: PublicKey;
    tokenMint: PublicKey;
    vault: PublicKey;
    store: PublicKey;
    auctionManager: PublicKey;
    bidRedemption: PublicKey;
    safetyDepositTokenStore: PublicKey;
    safetyDeposit: PublicKey;
    fractionMint: PublicKey;
    safetyDepositConfig: PublicKey;
    transferAuthority: PublicKey;
    metadata: PublicKey;
}
export declare const getRedeemFRTBidTransactions: ({ accountRentExempt, bidder, tokenMint, store, vault, auction, auctionManager, auctionExtended, bidRedemption, bidderMeta: bidMetadata, safetyDepositTokenStore, safetyDeposit, fractionMint, safetyDepositConfig, transferAuthority, metadata, }: IRedeemBidTransactionsParams) => Promise<TransactionsBatch>;
export declare const getBidRedemptionPDA: (auction: PublicKey, bidderMeta: PublicKey) => Promise<PublicKey>;
export {};
