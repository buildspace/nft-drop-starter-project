import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
import { Metadata, SignMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { sendTransaction } from './transactions';

interface SignMetadataParams {
  connection: Connection;
  wallet: Wallet;
  editionMint: PublicKey;
  signer?: Keypair;
}

export const signMetadata = async (
  { connection, wallet, editionMint, signer } = {} as SignMetadataParams,
): Promise<string> => {
  const metadata = await Metadata.getPDA(editionMint);
  const signTx = new SignMetadata(
    { feePayer: wallet.publicKey },
    {
      metadata,
      creator: signer ? signer.publicKey : wallet.publicKey,
    },
  );
  return await sendTransaction({
    connection,
    signers: signer ? [signer] : [],
    txs: [signTx],
    wallet,
  });
};
