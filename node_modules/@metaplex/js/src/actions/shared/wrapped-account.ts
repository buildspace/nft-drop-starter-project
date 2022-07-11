import { Transaction } from '@metaplex-foundation/mpl-core';
import { AccountLayout, NATIVE_MINT, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { CreateTokenAccount } from '../../transactions/CreateTokenAccount';

interface WrappedAccountTxs {
  account: Keypair;
  createTokenAccountTx: Transaction;
  closeTokenAccountTx: Transaction;
}

export async function createWrappedAccountTxs(
  connection: Connection,
  owner: PublicKey,
  amount = 0,
): Promise<WrappedAccountTxs> {
  const account = Keypair.generate();
  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(AccountLayout.span);
  const createTokenAccountTx = new CreateTokenAccount(
    { feePayer: owner },
    {
      newAccountPubkey: account.publicKey,
      lamports: amount + accountRentExempt,
      mint: NATIVE_MINT,
    },
  );
  const closeTokenAccountTx = new Transaction().add(
    Token.createCloseAccountInstruction(TOKEN_PROGRAM_ID, account.publicKey, owner, owner, []),
  );
  return { account, createTokenAccountTx, closeTokenAccountTx };
}
