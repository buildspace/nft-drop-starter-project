import { u64 } from '@solana/spl-token';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Optional } from '../../types';
interface CreateApproveParams {
    authority: Keypair;
    account: PublicKey;
    owner: PublicKey;
    amount: number | u64;
}
export declare function createApproveTxs(args: Optional<CreateApproveParams, 'authority'>): {
    authority: Keypair;
    createApproveTx: Transaction;
    createRevokeTx: Transaction;
};
export {};
