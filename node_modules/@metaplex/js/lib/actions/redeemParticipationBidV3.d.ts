import { PublicKey, TransactionSignature } from '@solana/web3.js';
import { Wallet } from '../wallet';
import { Connection } from '../Connection';
import { ParticipationConfigV2 } from '@metaplex-foundation/mpl-metaplex';
interface IRedeemParticipationBidV3Params {
    connection: Connection;
    wallet: Wallet;
    auction: PublicKey;
    store: PublicKey;
}
interface IRedeemParticipationBidV3Response {
    txIds: TransactionSignature[];
}
export declare const redeemParticipationBidV3: ({ connection, wallet, store, auction, }: IRedeemParticipationBidV3Params) => Promise<IRedeemParticipationBidV3Response>;
export declare function isEligibleForParticipationPrize(winIndex: number, { nonWinningConstraint, winnerConstraint }?: ParticipationConfigV2): boolean;
export {};
