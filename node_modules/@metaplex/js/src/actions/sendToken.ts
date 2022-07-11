import { PublicKey } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
import { sendTransaction } from './transactions';
import { Account, Transaction } from '@metaplex-foundation/mpl-core';
import { CreateAssociatedTokenAccount } from '../transactions/CreateAssociatedTokenAccount';

interface ISendTokenParams {
  connection: Connection;
  wallet: Wallet;
  // token account address
  source: PublicKey;
  // destination wallet address
  destination: PublicKey;
  mint: PublicKey;
  amount: number | u64;
}

interface ISendTokenResponse {
  txId: string;
}

export const sendToken = async ({
  connection,
  wallet,
  source,
  destination,
  mint,
  amount,
}: ISendTokenParams): Promise<ISendTokenResponse> => {
  const txs = [];
  const destAta = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    destination,
  );
  const transactionCtorFields = {
    feePayer: wallet.publicKey,
  };

  try {
    // check if the account exists
    await Account.load(connection, destAta);
  } catch {
    txs.push(
      new CreateAssociatedTokenAccount(transactionCtorFields, {
        associatedTokenAddress: destAta,
        splTokenMintAddress: mint,
        walletAddress: destination,
      }),
    );
  }

  txs.push(
    new Transaction(transactionCtorFields).add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        source,
        destAta,
        wallet.publicKey,
        [],
        amount,
      ),
    ),
  );

  const txId = await sendTransaction({ connection, wallet, txs });

  return { txId };
};
