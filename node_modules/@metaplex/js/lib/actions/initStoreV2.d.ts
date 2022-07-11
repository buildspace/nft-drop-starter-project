import { PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
interface IInitStoreV2Params {
    connection: Connection;
    wallet: Wallet;
    isPublic?: boolean;
    settingsUri?: string | null;
}
interface IInitStoreV2Response {
    storeId: PublicKey;
    configId: PublicKey;
    txId: string;
}
export declare const initStoreV2: ({ connection, wallet, settingsUri, isPublic, }: IInitStoreV2Params) => Promise<IInitStoreV2Response>;
export {};
