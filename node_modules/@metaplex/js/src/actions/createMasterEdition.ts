import { Connection, PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
import {
  CreateMasterEdition,
  MasterEdition,
  Metadata,
} from '@metaplex-foundation/mpl-token-metadata';
import { sendTransaction } from './transactions';
import BN from 'bn.js';

interface CreateMasterEditionParams {
  connection: Connection;
  wallet: Wallet;
  editionMint: PublicKey;
  updateAuthority?: PublicKey;
  maxSupply?: BN;
}

/*
 * NOTE 1: a metadata account must already exist
 * NOTE 2: must have exactly 1 editionMint token with 0 decimals outstanding
 */
export const createMasterEdition = async (
  { connection, wallet, editionMint, updateAuthority, maxSupply } = {} as CreateMasterEditionParams,
): Promise<string> => {
  const metadata = await Metadata.getPDA(editionMint);
  const edition = await MasterEdition.getPDA(editionMint);

  const createMetadataTx = new CreateMasterEdition(
    { feePayer: wallet.publicKey },
    {
      edition,
      metadata,
      updateAuthority: updateAuthority ?? wallet.publicKey,
      mint: editionMint,
      mintAuthority: wallet.publicKey,
      maxSupply,
    },
  );
  return sendTransaction({
    connection,
    signers: [],
    txs: [createMetadataTx],
    wallet,
  });
};
