import { PublicKey } from '@solana/web3.js';
import { u64 } from '@solana/spl-token';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
interface ISendTokenParams {
    connection: Connection;
    wallet: Wallet;
    source: PublicKey;
    destination: PublicKey;
    mint: PublicKey;
    amount: number | u64;
}
interface ISendTokenResponse {
    txId: string;
}
export declare const sendToken: ({ connection, wallet, source, destination, mint, amount, }: ISendTokenParams) => Promise<ISendTokenResponse>;
export {};
