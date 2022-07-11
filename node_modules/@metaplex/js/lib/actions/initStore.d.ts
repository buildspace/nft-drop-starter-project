import { PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
interface IInitStoreParams {
    connection: Connection;
    wallet: Wallet;
    isPublic?: boolean;
}
interface IInitStoreResponse {
    storeId: PublicKey;
    txId: string;
}
export declare const initStore: ({ connection, wallet, isPublic, }: IInitStoreParams) => Promise<IInitStoreResponse>;
export {};
