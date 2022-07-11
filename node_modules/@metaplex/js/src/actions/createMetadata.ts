import { Connection, PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
import {
  CreateMetadata,
  Metadata,
  MetadataDataData,
} from '@metaplex-foundation/mpl-token-metadata';
import { sendTransaction } from './transactions';

interface CreateMetadataParams {
  connection: Connection;
  wallet: Wallet;
  editionMint: PublicKey; // can be any mint with 0 decimals
  metadataData: MetadataDataData;
  updateAuthority?: PublicKey;
}

export const createMetadata = async (
  { connection, wallet, editionMint, metadataData, updateAuthority } = {} as CreateMetadataParams,
): Promise<string> => {
  const metadata = await Metadata.getPDA(editionMint);

  const createMetadataTx = new CreateMetadata(
    { feePayer: wallet.publicKey },
    {
      metadata,
      metadataData,
      updateAuthority: updateAuthority ?? wallet.publicKey,
      mint: editionMint,
      mintAuthority: wallet.publicKey,
    },
  );
  return sendTransaction({
    connection,
    signers: [],
    txs: [createMetadataTx],
    wallet,
  });
};
