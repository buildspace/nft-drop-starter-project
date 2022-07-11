import { Transaction } from '@metaplex-foundation/mpl-core';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
interface WrappedAccountTxs {
    account: Keypair;
    createTokenAccountTx: Transaction;
    closeTokenAccountTx: Transaction;
}
export declare function createWrappedAccountTxs(connection: Connection, owner: PublicKey, amount?: number): Promise<WrappedAccountTxs>;
export {};
