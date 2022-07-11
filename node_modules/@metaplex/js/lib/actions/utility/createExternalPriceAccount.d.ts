import { PublicKey, TransactionSignature } from '@solana/web3.js';
import { Wallet } from '../../wallet';
import { Connection } from '../../Connection';
interface CreateExternalPriceAccountParams {
    connection: Connection;
    wallet: Wallet;
}
interface CreateExternalPriceAccountResponse {
    txId: TransactionSignature;
    externalPriceAccount: PublicKey;
    priceMint: PublicKey;
}
export declare const createExternalPriceAccount: ({ connection, wallet, }: CreateExternalPriceAccountParams) => Promise<CreateExternalPriceAccountResponse>;
export {};
