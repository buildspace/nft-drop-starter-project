import { web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SystemProgram } from '@solana/web3.js';
import {
  LAMPORTS_PER_SOL,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';

// CLI Properties Given to us
const candyMachineProgram = new web3.PublicKey(
  'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ'
);

const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3.PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);

const CIVIC = new anchor.web3.PublicKey(
  'gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs',
);

const toDate = (value) => {
  if (!value) {
    return;
  }

  return new Date(value.toNumber() * 1000);
};

const numberFormater = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatNumber = {
  format: (val) => {
    if (!val) {
      return '--';
    }

    return numberFormater.format(val);
  },
  asNumber: (val) => {
    if (!val) {
      return undefined;
    }

    return val.toNumber() / LAMPORTS_PER_SOL;
  },
};

const getAtaForMint = async (mint, buyer)=> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [buyer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  );
};

const getNetworkExpire = async (gatekeeperNetwork) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [gatekeeperNetwork.toBuffer(), Buffer.from('expire')],
    CIVIC,
  );
};

const getNetworkToken = async (wallet, gatekeeperNetwork) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      wallet.toBuffer(),
      Buffer.from('gateway'),
      Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]),
      gatekeeperNetwork.toBuffer(),
    ],
    CIVIC,
  );
};

function createAssociatedTokenAccountInstruction(
  associatedTokenAddress,
  payer,
  walletAddress,
  splTokenMintAddress,
) {
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
  });
}

export {
  candyMachineProgram,
  TOKEN_METADATA_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  CIVIC,
  toDate,
  formatNumber,
  getAtaForMint,
  getNetworkExpire,
  getNetworkToken,
  createAssociatedTokenAccountInstruction,
};
