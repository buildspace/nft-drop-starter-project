import BN from 'bn.js';
import { Connection, TransactionSignature, PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
interface Token2Add {
    tokenAccount: PublicKey;
    tokenMint: PublicKey;
    amount: BN;
}
interface SafetyDepositTokenStore {
    txId: TransactionSignature;
    tokenAccount: PublicKey;
    tokenStoreAccount: PublicKey;
    tokenMint: PublicKey;
}
interface AddTokensToVaultParams {
    connection: Connection;
    wallet: Wallet;
    vault: PublicKey;
    nfts: Token2Add[];
}
interface AddTokensToVaultResponse {
    safetyDepositTokenStores: SafetyDepositTokenStore[];
}
export declare const addTokensToVault: ({ connection, wallet, vault, nfts, }: AddTokensToVaultParams) => Promise<AddTokensToVaultResponse>;
export {};
