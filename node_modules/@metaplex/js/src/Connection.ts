import { clusterApiUrl, Commitment, Connection as SolanaConnection } from '@solana/web3.js';

export enum ChainId {
  MainnetBeta = 101,
  Testnet = 102,
  Devnet = 103,
}

export const ENV: Record<string, { endpoint: string; ChainId: ChainId }> = {
  devnet: {
    endpoint: clusterApiUrl('devnet'),
    ChainId: ChainId.Devnet,
  },
  'mainnet-beta': {
    endpoint: 'https://api.metaplex.solana.com/',
    ChainId: ChainId.MainnetBeta,
  },
  'mainnet-beta (Solana)': {
    endpoint: 'https://api.mainnet-beta.solana.com',
    ChainId: ChainId.MainnetBeta,
  },
  'mainnet-beta (Serum)': {
    endpoint: 'https://solana-api.projectserum.com/',
    ChainId: ChainId.MainnetBeta,
  },
  testnet: {
    endpoint: clusterApiUrl('testnet'),
    ChainId: ChainId.Testnet,
  },
};

export class Connection extends SolanaConnection {
  constructor(endpoint: keyof typeof ENV | string = 'mainnet-beta', commitment?: Commitment) {
    if (endpoint in ENV) endpoint = ENV[endpoint].endpoint;
    super(endpoint, commitment);
  }
}
