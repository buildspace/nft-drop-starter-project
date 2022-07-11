import { Connection, PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
import BN from 'bn.js';
interface CreateMasterEditionParams {
    connection: Connection;
    wallet: Wallet;
    editionMint: PublicKey;
    updateAuthority?: PublicKey;
    maxSupply?: BN;
}
export declare const createMasterEdition: ({ connection, wallet, editionMint, updateAuthority, maxSupply }?: CreateMasterEditionParams) => Promise<string>;
export {};
