/// <reference types="@solana/spl-token" />
/// <reference types="@metaplex-foundation/amman/node_modules/@solana/web3.js" />
import { Connection, Keypair } from '@solana/web3.js';
import debug from 'debug';
import { TransactionHandler } from '@metaplex-foundation/amman';
export * from './address-labels';
export * from './metadata';
export declare const logError: debug.Debugger;
export declare const logInfo: debug.Debugger;
export declare const logDebug: debug.Debugger;
export declare const logTrace: debug.Debugger;
export declare const programIds: {
    metadata: string;
    vault: string;
    auction: string;
    metaplex: string;
};
export declare const DEVNET: string;
export declare const connectionURL: string;
export declare function dump(x: object): void;
export declare function killStuckProcess(): void;
export declare function createCollection(connection: Connection, transactionHandler: TransactionHandler, payer: Keypair): Promise<{
    mint: import("@solana/spl-token").Token;
    metadata: import("@solana/web3.js").PublicKey;
    masterEditionPubkey: import("@solana/web3.js").PublicKey;
    createTxDetails: import("@metaplex-foundation/amman").ConfirmedTransactionDetails;
}>;
