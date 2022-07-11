import { Connection, PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
import {
  Metadata,
  MetadataDataData,
  UpdateMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import { sendTransaction } from './transactions';

interface UpdateMetadataParams {
  connection: Connection;
  wallet: Wallet;
  editionMint: PublicKey;
  newMetadataData?: MetadataDataData;
  newUpdateAuthority?: PublicKey;
  primarySaleHappened?: boolean;
}

/*
 * Can be used to update any of the below 3:
 * 1) data inside metadata, but only if it's mutable (which is only possible for MasterEditions)
 * 2) updateAuthority
 * 3) whether primary sale has happened (can only be set true, never back false)
 */
export const updateMetadata = async (
  {
    connection,
    wallet,
    editionMint,
    newMetadataData,
    newUpdateAuthority,
    primarySaleHappened,
  } = {} as UpdateMetadataParams,
): Promise<string> => {
  const metadata = await Metadata.getPDA(editionMint);
  const updateTx = new UpdateMetadata(
    { feePayer: wallet.publicKey },
    {
      metadata,
      updateAuthority: wallet.publicKey,
      metadataData: newMetadataData,
      newUpdateAuthority,
      primarySaleHappened,
    },
  );
  return sendTransaction({
    connection,
    signers: [],
    txs: [updateTx],
    wallet,
  });
};
