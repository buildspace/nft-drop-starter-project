import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Transaction } from '@metaplex-foundation/mpl-core';
interface MintTxs {
    mint: Keypair;
    recipient: PublicKey;
    createMintTx: Transaction;
    createAssociatedTokenAccountTx: Transaction;
    mintToTx: Transaction;
}
export declare function prepareTokenAccountAndMintTxs(connection: Connection, owner: PublicKey): Promise<MintTxs>;
export {};
