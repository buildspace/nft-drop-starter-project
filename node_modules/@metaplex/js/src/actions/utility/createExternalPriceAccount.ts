import BN from 'bn.js';
import {
  ExternalPriceAccountData,
  Vault,
  VaultProgram,
  UpdateExternalPriceAccount,
} from '@metaplex-foundation/mpl-token-vault';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionCtorFields,
  TransactionSignature,
} from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import { Transaction } from '@metaplex-foundation/mpl-core';

import { Wallet } from '../../wallet';
import { Connection } from '../../Connection';
import { sendTransaction } from '../transactions';
import { TransactionsBatch } from '../../utils/transactions-batch';

interface CreateExternalPriceAccountParams {
  connection: Connection;
  wallet: Wallet;
}

interface CreateExternalPriceAccountResponse {
  txId: TransactionSignature;
  externalPriceAccount: PublicKey;
  priceMint: PublicKey;
}

// This command creates the external pricing oracle
export const createExternalPriceAccount = async ({
  connection,
  wallet,
}: CreateExternalPriceAccountParams): Promise<CreateExternalPriceAccountResponse> => {
  const txBatch = new TransactionsBatch({ transactions: [] });
  const txOptions: TransactionCtorFields = { feePayer: wallet.publicKey };

  const epaRentExempt = await connection.getMinimumBalanceForRentExemption(
    Vault.MAX_EXTERNAL_ACCOUNT_SIZE,
  );

  const externalPriceAccount = Keypair.generate();

  const externalPriceAccountData = new ExternalPriceAccountData({
    pricePerShare: new BN(0),
    priceMint: NATIVE_MINT.toBase58(),
    allowedToCombine: true,
  });

  const uninitializedEPA = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: externalPriceAccount.publicKey,
      lamports: epaRentExempt,
      space: Vault.MAX_EXTERNAL_ACCOUNT_SIZE,
      programId: VaultProgram.PUBKEY,
    }),
  );
  txBatch.addTransaction(uninitializedEPA);
  txBatch.addSigner(externalPriceAccount);

  const updateEPA = new UpdateExternalPriceAccount(txOptions, {
    externalPriceAccount: externalPriceAccount.publicKey,
    externalPriceAccountData,
  });
  txBatch.addTransaction(updateEPA);

  const txId = await sendTransaction({
    connection,
    signers: txBatch.signers,
    txs: txBatch.transactions,
    wallet,
  });

  return {
    txId,
    externalPriceAccount: externalPriceAccount.publicKey,
    priceMint: NATIVE_MINT,
  };
};
