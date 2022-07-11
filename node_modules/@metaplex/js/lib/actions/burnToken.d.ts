import { PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
import { u64 } from '@solana/spl-token';
interface IBurnTokenParams {
    connection: Connection;
    wallet: Wallet;
    token: PublicKey;
    mint: PublicKey;
    amount: number | u64;
    owner?: PublicKey;
    close?: boolean;
}
interface IBurnTokenResponse {
    txId: string;
}
export declare const burnToken: ({ connection, wallet, token, mint, amount, owner, close, }: IBurnTokenParams) => Promise<IBurnTokenResponse>;
export {};
