/// <reference types="node" />
import { PublicKey, Connection, GetProgramAccountsConfig, Commitment } from '@solana/web3.js';
import { Account } from './accounts';
import { Buffer } from 'buffer';
export declare abstract class Program {
    static readonly PUBKEY: PublicKey;
    static findProgramAddress(seeds: (Buffer | Uint8Array)[]): Promise<PublicKey>;
    static getProgramAccounts(connection: Connection, configOrCommitment?: GetProgramAccountsConfig | Commitment): Promise<Account<unknown>[]>;
}
