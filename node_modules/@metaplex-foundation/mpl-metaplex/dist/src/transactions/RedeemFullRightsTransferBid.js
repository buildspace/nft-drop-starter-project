"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemFullRightsTransferBid = exports.RedeemFullRightsTransferBidArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const mpl_token_vault_1 = require("@metaplex-foundation/mpl-token-vault");
const MetaplexProgram_1 = require("../MetaplexProgram");
const RedeemBid_1 = require("./RedeemBid");
class RedeemFullRightsTransferBidArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 3;
    }
}
exports.RedeemFullRightsTransferBidArgs = RedeemFullRightsTransferBidArgs;
_a = RedeemFullRightsTransferBidArgs;
RedeemFullRightsTransferBidArgs.SCHEMA = _a.struct([['instruction', 'u8']]);
class RedeemFullRightsTransferBid extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { store, vault, auction, auctionExtended, auctionManager, bidRedemption, bidMetadata, safetyDepositTokenStore, destination, safetyDeposit, fractionMint, bidder, safetyDepositConfig, transferAuthority, masterMetadata, newAuthority, auctioneerReclaimIndex, } = params;
        const data = auctioneerReclaimIndex
            ? RedeemBid_1.RedeemUnusedWinningConfigItemsAsAuctioneerArgs.serialize({
                winningConfigItemIndex: auctioneerReclaimIndex,
                proxyCall: RedeemBid_1.ProxyCallAddress.RedeemFullRightsTransferBid,
            })
            : RedeemFullRightsTransferBidArgs.serialize();
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
                    pubkey: fractionMint,
                    isSigner: false,
                    isWritable: true,
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
                    isWritable: false,
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
                    pubkey: masterMetadata,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: newAuthority,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: transferAuthority,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: safetyDepositConfig,
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
exports.RedeemFullRightsTransferBid = RedeemFullRightsTransferBid;
//# sourceMappingURL=RedeemFullRightsTransferBid.js.map