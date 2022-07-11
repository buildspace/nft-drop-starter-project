import { Keypair, SendOptions } from '@solana/web3.js';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
import { Transaction } from '@metaplex-foundation/mpl-core';

interface ISendTransactionParams {
  connection: Connection;
  wallet: Wallet;
  txs: Transaction[];
  signers?: Keypair[];
  options?: SendOptions;
}

export const sendTransaction = async ({
  connection,
  wallet,
  txs,
  signers = [],
  options,
}: ISendTransactionParams): Promise<string> => {
  let tx = Transaction.fromCombined(txs, { feePayer: wallet.publicKey });
  tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

  if (signers.length) {
    tx.partialSign(...signers);
  }
  tx = await wallet.signTransaction(tx);

  return connection.sendRawTransaction(tx.serialize(), options);
};
