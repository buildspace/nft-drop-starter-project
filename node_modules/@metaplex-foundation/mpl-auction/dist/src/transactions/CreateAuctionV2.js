"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAuctionV2 = exports.CreateAuctionV2Args = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const AuctionProgram_1 = require("../AuctionProgram");
const Auction_1 = require("../accounts/Auction");
const CreateAuction_1 = require("./CreateAuction");
class CreateAuctionV2Args extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 7;
    }
}
exports.CreateAuctionV2Args = CreateAuctionV2Args;
_a = CreateAuctionV2Args;
CreateAuctionV2Args.SCHEMA = new Map([
    ...CreateAuction_1.WinnerLimit.SCHEMA,
    ...Auction_1.PriceFloor.SCHEMA,
    ..._a.struct([
        ['instruction', 'u8'],
        ['winners', CreateAuction_1.WinnerLimit],
        ['endAuctionAt', { kind: 'option', type: 'u64' }],
        ['auctionGap', { kind: 'option', type: 'u64' }],
        ['tokenMint', 'pubkeyAsString'],
        ['authority', 'pubkeyAsString'],
        ['resource', 'pubkeyAsString'],
        ['priceFloor', Auction_1.PriceFloor],
        ['tickSize', { kind: 'option', type: 'u64' }],
        ['gapTickSizePercentage', { kind: 'option', type: 'u8' }],
        ['instantSalePrice', { kind: 'option', type: 'u64' }],
        ['name', { kind: 'option', type: [32] }],
    ]),
]);
class CreateAuctionV2 extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { args, auction, auctionExtended, creator } = params;
        const data = CreateAuctionV2Args.serialize(args);
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
exports.CreateAuctionV2 = CreateAuctionV2;
//# sourceMappingURL=CreateAuctionV2.js.map