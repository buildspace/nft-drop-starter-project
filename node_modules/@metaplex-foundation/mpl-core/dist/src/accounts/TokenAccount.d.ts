/// <reference types="node" />
import { AnyPublicKey } from '../types';
import { Account } from './Account';
import { AccountInfo as TokenAccountInfo } from '@solana/spl-token';
import { AccountInfo, Connection } from '@solana/web3.js';
import { Buffer } from 'buffer';
export declare class TokenAccount extends Account<TokenAccountInfo> {
    constructor(pubkey: AnyPublicKey, info: AccountInfo<Buffer>);
    static isCompatible(data: Buffer): boolean;
    static getTokenAccountsByOwner(connection: Connection, owner: AnyPublicKey): Promise<TokenAccount[]>;
}
export declare const deserialize: (data: Buffer) => any;
