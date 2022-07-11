import BN from 'bn.js';
import { Commitment, PublicKey, TransactionSignature } from '@solana/web3.js';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
interface IPlaceBidParams {
    connection: Connection;
    wallet: Wallet;
    auction: PublicKey;
    bidderPotToken?: PublicKey;
    amount: BN;
    commitment?: Commitment;
}
interface IPlaceBidResponse {
    txId: TransactionSignature;
    bidderPotToken: PublicKey;
    bidderMeta: PublicKey;
}
export declare const placeBid: ({ connection, wallet, amount, auction, bidderPotToken, }: IPlaceBidParams) => Promise<IPlaceBidResponse>;
export {};
