"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemBid = exports.RedeemUnusedWinningConfigItemsAsAuctioneerArgs = exports.ProxyCallAddress = exports.RedeemBidArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const mpl_token_vault_1 = require("@metaplex-foundation/mpl-token-vault");
const MetaplexProgram_1 = require("../MetaplexProgram");
class RedeemBidArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 2;
    }
}
exports.RedeemBidArgs = RedeemBidArgs;
_a = RedeemBidArgs;
RedeemBidArgs.SCHEMA = _a.struct([['instruction', 'u8']]);
var ProxyCallAddress;
(function (ProxyCallAddress) {
    ProxyCallAddress[ProxyCallAddress["RedeemBid"] = 0] = "RedeemBid";
    ProxyCallAddress[ProxyCallAddress["RedeemFullRightsTransferBid"] = 1] = "RedeemFullRightsTransferBid";
})(ProxyCallAddress = exports.ProxyCallAddress || (exports.ProxyCallAddress = {}));
class RedeemUnusedWinningConfigItemsAsAuctioneerArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 12;
    }
}
exports.RedeemUnusedWinningConfigItemsAsAuctioneerArgs = RedeemUnusedWinningConfigItemsAsAuctioneerArgs;
_b = RedeemUnusedWinningConfigItemsAsAuctioneerArgs;
RedeemUnusedWinningConfigItemsAsAuctioneerArgs.SCHEMA = _b.struct([
    ['instruction', 'u8'],
    ['winningConfigItemIndex', 'u8'],
    ['proxyCall', 'u8'],
]);
class RedeemBid extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { store, vault, auction, auctionExtended, auctionManager, bidRedemption, bidderMeta: bidMetadata, safetyDepositTokenStore, destination, safetyDeposit, fractionMint, bidder, isPrintingType, safetyDepositConfig, transferAuthority, masterEdition, reservationList, auctioneerReclaimIndex, } = params;
        const data = auctioneerReclaimIndex
            ? RedeemUnusedWinningConfigItemsAsAuctioneerArgs.serialize({
                winningConfigItemIndex: auctioneerReclaimIndex,
                proxyCall: ProxyCallAddress.RedeemBid,
            })
            : RedeemBidArgs.serialize();
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
                ...(isPrintingType && masterEdition && reservationList
                    ? [
                        {
                            pubkey: masterEdition,
                            isSigner: false,
                            isWritable: true,
                        },
                        {
                            pubkey: reservationList,
                            isSigner: false,
                            isWritable: true,
                        },
                    ]
                    : []),
            ],
            programId: MetaplexProgram_1.MetaplexProgram.PUBKEY,
            data,
        }));
    }
}
exports.RedeemBid = RedeemBid;
//# sourceMappingURL=RedeemBid.js.map