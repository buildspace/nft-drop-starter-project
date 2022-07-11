"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAuction = exports.CreateAuctionArgs = exports.WinnerLimit = exports.WinnerLimitType = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const AuctionProgram_1 = require("../AuctionProgram");
const Auction_1 = require("../accounts/Auction");
var WinnerLimitType;
(function (WinnerLimitType) {
    WinnerLimitType[WinnerLimitType["Unlimited"] = 0] = "Unlimited";
    WinnerLimitType[WinnerLimitType["Capped"] = 1] = "Capped";
})(WinnerLimitType = exports.WinnerLimitType || (exports.WinnerLimitType = {}));
class WinnerLimit extends mpl_core_1.Borsh.Data {
}
exports.WinnerLimit = WinnerLimit;
WinnerLimit.SCHEMA = WinnerLimit.struct([
    ['type', 'u8'],
    ['usize', 'u64'],
]);
class CreateAuctionArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 1;
    }
}
exports.CreateAuctionArgs = CreateAuctionArgs;
CreateAuctionArgs.SCHEMA = new Map([
    ...WinnerLimit.SCHEMA,
    ...Auction_1.PriceFloor.SCHEMA,
    ...CreateAuctionArgs.struct([
        ['instruction', 'u8'],
        ['winners', WinnerLimit],
        ['endAuctionAt', { kind: 'option', type: 'u64' }],
        ['auctionGap', { kind: 'option', type: 'u64' }],
        ['tokenMint', 'pubkeyAsString'],
        ['authority', 'pubkeyAsString'],
        ['resource', 'pubkeyAsString'],
        ['priceFloor', Auction_1.PriceFloor],
        ['tickSize', { kind: 'option', type: 'u64' }],
        ['gapTickSizePercentage', { kind: 'option', type: 'u8' }],
    ]),
]);
class CreateAuction extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { args, auction, auctionExtended, creator } = params;
        const data = CreateAuctionArgs.serialize(args);
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: creator,
                    isSigner: true,
                    isWritable: true,
                },
                {
                    pubkey: auction,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: auctionExtended,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: web3_js_1.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: AuctionProgram_1.AuctionProgram.PUBKEY,
            data,
        }));
    }
}
exports.CreateAuction = CreateAuction;
//# sourceMappingURL=CreateAuction.js.map