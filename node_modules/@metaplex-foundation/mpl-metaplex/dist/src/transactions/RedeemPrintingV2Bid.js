"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemPrintingV2Bid = exports.RedeemPrintingV2BidArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const mpl_token_vault_1 = require("@metaplex-foundation/mpl-token-vault");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const MetaplexProgram_1 = require("../MetaplexProgram");
class RedeemPrintingV2BidArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 14;
    }
}
exports.RedeemPrintingV2BidArgs = RedeemPrintingV2BidArgs;
_a = RedeemPrintingV2BidArgs;
RedeemPrintingV2BidArgs.SCHEMA = _a.struct([
    ['instruction', 'u8'],
    ['editionOffset', 'u64'],
    ['winIndex', 'u64'],
]);
class RedeemPrintingV2Bid extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { store, vault, auction, auctionExtended, auctionManager, bidRedemption, bidMetadata, safetyDepositTokenStore, destination, safetyDeposit, bidder, safetyDepositConfig, metadata, prizeTrackingTicket, newMetadata, newEdition, masterEdition, newMint, editionMark, winIndex, editionOffset, } = params;
        const data = RedeemPrintingV2BidArgs.serialize({ winIndex, editionOffset });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: auctionManager,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: safetyDepositTokenStore,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: destination,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: bidRedemption,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: safetyDeposit,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: vault,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: safetyDepositConfig,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: auction,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: bidMetadata,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: bidder,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: feePayer,
                    isSigner: true,
                    isWritable: true,
                },
                {
                    pubkey: spl_token_1.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: mpl_token_vault_1.VaultProgram.PUBKEY,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: mpl_token_metadata_1.MetadataProgram.PUBKEY,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: store,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: web3_js_1.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: prizeTrackingTicket,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: newMetadata,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: newEdition,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: masterEdition,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: newMint,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: editionMark,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: feePayer,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: metadata,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: auctionExtended,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: MetaplexProgram_1.MetaplexProgram.PUBKEY,
            data,
        }));
    }
}
exports.RedeemPrintingV2Bid = RedeemPrintingV2Bid;
//# sourceMappingURL=RedeemPrintingV2Bid.js.map