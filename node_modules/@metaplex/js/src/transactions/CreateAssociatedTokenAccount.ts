import { Transaction } from '@metaplex-foundation/mpl-core';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionCtorFields,
  TransactionInstruction,
} from '@solana/web3.js';
import { Buffer } from 'buffer';

type CreateAssociatedTokenAccountParams = {
  associatedTokenAddress: PublicKey;
  walletAddress?: PublicKey;
  splTokenMintAddress: PublicKey;
};

export class CreateAssociatedTokenAccount extends Transaction {
  constructor(options: TransactionCtorFields, params: CreateAssociatedTokenAccountParams) {
    const { feePayer } = options;
    const { associatedTokenAddress, walletAddress, splTokenMintAddress } = params;
    super(options);

    this.add(
      new TransactionInstruction({
        keys: [
          {
            pubkey: feePayer,
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: associatedTokenAddress,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: walletAddress ?? feePayer,
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
        ],
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
      }),
    );
  }
}
