import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
import BN from 'bn.js';
import { Transaction } from '@metaplex-foundation/mpl-core';

type MintToParams = {
  mint: PublicKey;
  dest: PublicKey;
  amount: number | BN;
  authority?: PublicKey;
};

export class MintTo extends Transaction {
  constructor(options: TransactionCtorFields, params: MintToParams) {
    const { feePayer } = options;
    const { mint, dest, authority, amount } = params;

    super(options);

    this.add(
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mint,
        dest,
        authority ?? feePayer,
        [],
        new BN(amount).toNumber(),
      ),
    );
  }
}
