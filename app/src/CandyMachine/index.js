import React, { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { MintLayout, TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { programs } from '@metaplex/js';
import './CandyMachine.css';
import {
  candyMachineProgram,
  TOKEN_METADATA_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
} from './helpers';
const {
  metadata: { Metadata, MetadataProgram },
} = programs;

const config = new web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_CONFIG);
const { SystemProgram } = web3;
const opts = {
  preflightCommitment: 'processed',
};

const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;

const CandyMachine = ({ walletAddress }) => {
  // States
  const [mints, setMints] = useState([]);
  const [machineStats, setMachineStats] = useState(null);

  // Actions
  const fetchHashTable = async (hash, metadataEnabled) => {
    const connection = new web3.Connection(
      process.env.REACT_APP_SOLANA_RPC_HOST
    );

    const metadataAccounts = await MetadataProgram.getProgramAccounts(
      connection,
      {
        filters: [
          {
            memcmp: {
              offset:
                1 +
                32 +
                32 +
                4 +
                MAX_NAME_LENGTH +
                4 +
                MAX_URI_LENGTH +
                4 +
                MAX_SYMBOL_LENGTH +
                2 +
                1 +
                4 +
                0 * MAX_CREATOR_LEN,
              bytes: hash,
            },
          },
        ],
      }
    );

    const mintHashes = [];

    for (let index = 0; index < metadataAccounts.length; index++) {
      const account = metadataAccounts[index];
      const accountInfo = await connection.getParsedAccountInfo(account.pubkey);
      const metadata = new Metadata(hash.toString(), accountInfo.value);
      if (metadataEnabled) mintHashes.push(metadata.data);
      else mintHashes.push(metadata.data.mint);
    }

    return mintHashes;
  };

  const getCandyMachineState = async () => {};

  const getMetadata = async (mint) => {
    return (
      await PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };

  const getMasterEdition = async (mint) => {
    return (
      await PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
          Buffer.from('edition'),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };

  const getTokenWallet = async (wallet, mint) => {
    return (
      await web3.PublicKey.findProgramAddress(
        [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      )
    )[0];
  };

  const mintToken = async () => {
    try {
      const mint = web3.Keypair.generate();
      const token = await getTokenWallet(
        walletAddress.publicKey,
        mint.publicKey
      );
      const metadata = await getMetadata(mint.publicKey);
      const masterEdition = await getMasterEdition(mint.publicKey);
      const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;
      const connection = new Connection(rpcHost);
      const rent = await connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      );

      const accounts = {
        config,
        candyMachine: process.env.REACT_APP_CANDY_MACHINE_ID,
        payer: walletAddress.publicKey,
        wallet: process.env.REACT_APP_TREASURY_ADDRESS,
        mint: mint.publicKey,
        metadata,
        masterEdition,
        mintAuthority: walletAddress.publicKey,
        updateAuthority: walletAddress.publicKey,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        clock: web3.SYSVAR_CLOCK_PUBKEY,
      };

      const signers = [mint];
      const instructions = [
        web3.SystemProgram.createAccount({
          fromPubkey: walletAddress.publicKey,
          newAccountPubkey: mint.publicKey,
          space: MintLayout.span,
          lamports: rent,
          programId: TOKEN_PROGRAM_ID,
        }),
        Token.createInitMintInstruction(
          TOKEN_PROGRAM_ID,
          mint.publicKey,
          0,
          walletAddress.publicKey,
          walletAddress.publicKey
        ),
        createAssociatedTokenAccountInstruction(
          token,
          walletAddress.publicKey,
          walletAddress.publicKey,
          mint.publicKey
        ),
        Token.createMintToInstruction(
          TOKEN_PROGRAM_ID,
          mint.publicKey,
          token,
          walletAddress.publicKey,
          [],
          1
        ),
      ];

      const provider = getProvider();
      const idl = await Program.fetchIdl(candyMachineProgram, provider);
      const program = new Program(idl, candyMachineProgram, provider);

      const txn = await program.rpc.mintNft({
        accounts,
        signers,
        instructions,
      });

      console.log('txn:', txn);

      // Setup listener
      connection.onSignatureWithOptions(
        txn,
        async (notification, context) => {
          if (notification.type === 'status') {
            console.log('Receievd status event');

            const { result } = notification;
            if (!result.err) {
              console.log('NFT Minted!');
              await getCandyMachineState();
            }
          }
        },
        { commitment: 'processed' }
      );
    } catch (error) {
      let message = error.msg || 'Minting failed! Please try again!';

      if (!error.msg) {
        if (error.message.indexOf('0x138')) {
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      console.warn(message);
    }
  };

  const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress,
    payer,
    walletAddress,
    splTokenMintAddress
  ) => {
    const keys = [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
      { pubkey: walletAddress, isSigner: false, isWritable: false },
      { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      {
        pubkey: web3.SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ];
    return new web3.TransactionInstruction({
      keys,
      programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      data: Buffer.from([]),
    });
  };

  return (
    machineStats && (
      <div className="machine-container">
        <p>{`Drop Date: ${machineStats.goLiveDateTimeString}`}</p>
        <p>{`Items Minted: ${machineStats.itemsRedeemed} / ${machineStats.itemsAvailable}`}</p>
        <button className="cta-button mint-button" onClick={mintToken}>
          Mint NFT
        </button>
      </div>
    )
  );
};

export default CandyMachine;
