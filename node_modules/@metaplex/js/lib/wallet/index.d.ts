import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
export interface Wallet {
    publicKey: PublicKey;
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
}
export declare class NodeWallet implements Wallet {
    readonly payer: Keypair;
    constructor(payer: Keypair);
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    get publicKey(): PublicKey;
}
