import BN from 'bn.js';
import { Transaction } from '@metaplex-foundation/mpl-core';
import { Keypair, PublicKey, TransactionSignature } from '@solana/web3.js';
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ActivateVault, CombineVault, Vault } from '@metaplex-foundation/mpl-token-vault';

import { Wallet } from '../../wallet';
import { Connection } from '../../Connection';
import { sendTransaction } from '../transactions';
import { CreateTokenAccount } from '../../transactions';
import { TransactionsBatch } from '../../utils/transactions-batch';

interface CloseVaultParams {
  connection: Connection;
  wallet: Wallet;
  vault: PublicKey;
  priceMint: PublicKey;
}

interface CloseVaultResponse {
  txId: TransactionSignature;
}

// This command "closes" the vault, by activating & combining it in one go, handing it over to the auction manager
// authority (that may or may not exist yet.)
export const closeVault = async ({
  connection,
  wallet,
  vault,
  priceMint,
}: CloseVaultParams): Promise<CloseVaultResponse> => {
  const accountRent = await connection.getMinimumBalanceForRentExemption(AccountLayout.span);

  const fractionMintAuthority = await Vault.getPDA(vault);

  const txBatch = new TransactionsBatch({ transactions: [] });

  const txOptions = { feePayer: wallet.publicKey };

  const {
    data: { fractionMint, fractionTreasury, redeemTreasury, pricingLookupAddress },
  } = await Vault.load(connection, vault);

  const fractionMintKey = new PublicKey(fractionMint);
  const fractionTreasuryKey = new PublicKey(fractionTreasury);
  const redeemTreasuryKey = new PublicKey(redeemTreasury);
  const pricingLookupAddressKey = new PublicKey(pricingLookupAddress);

  const activateVaultTx = new ActivateVault(txOptions, {
    vault,
    numberOfShares: new BN(0),
    fractionMint: fractionMintKey,
    fractionTreasury: fractionTreasuryKey,
    fractionMintAuthority,
    vaultAuthority: wallet.publicKey,
  });
  txBatch.addTransaction(activateVaultTx);

  const outstandingShareAccount = Keypair.generate();
  const outstandingShareAccountTx = new CreateTokenAccount(txOptions, {
    newAccountPubkey: outstandingShareAccount.publicKey,
    lamports: accountRent,
    mint: fractionMintKey,
    owner: wallet.publicKey,
  });
  txBatch.addTransaction(outstandingShareAccountTx);
  txBatch.addSigner(outstandingShareAccount);

  const payingTokenAccount = Keypair.generate();
  const payingTokenAccountTx = new CreateTokenAccount(txOptions, {
    newAccountPubkey: payingTokenAccount.publicKey,
    lamports: accountRent,
    mint: priceMint,
    owner: wallet.publicKey,
  });
  txBatch.addTransaction(payingTokenAccountTx);
  txBatch.addSigner(payingTokenAccount);

  const transferAuthority = Keypair.generate();

  const createApproveTx = (account: Keypair) =>
    new Transaction().add(
      Token.createApproveInstruction(
        TOKEN_PROGRAM_ID,
        account.publicKey,
        transferAuthority.publicKey,
        wallet.publicKey,
        [],
        0,
      ),
    );

  txBatch.addTransaction(createApproveTx(payingTokenAccount));
  txBatch.addTransaction(createApproveTx(outstandingShareAccount));
  txBatch.addSigner(transferAuthority);

  const combineVaultTx = new CombineVault(txOptions, {
    vault,
    outstandingShareTokenAccount: outstandingShareAccount.publicKey,
    payingTokenAccount: payingTokenAccount.publicKey,
    fractionMint: fractionMintKey,
    fractionTreasury: fractionTreasuryKey,
    redeemTreasury: redeemTreasuryKey,
    burnAuthority: fractionMintAuthority,
    externalPriceAccount: pricingLookupAddressKey,
    transferAuthority: transferAuthority.publicKey,
    vaultAuthority: wallet.publicKey,
    newVaultAuthority: wallet.publicKey,
  });
  txBatch.addTransaction(combineVaultTx);

  const txId = await sendTransaction({
    connection,
    signers: txBatch.signers,
    txs: txBatch.transactions,
    wallet,
  });

  return { txId };
};
