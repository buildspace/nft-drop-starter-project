"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndAuction = exports.EndAuctionArgs = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const mpl_auction_1 = require("@metaplex-foundation/mpl-auction");
const MetaplexProgram_1 = require("../MetaplexProgram");
class EndAuctionArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 20;
    }
}
exports.EndAuctionArgs = EndAuctionArgs;
_a = EndAuctionArgs;
EndAuctionArgs.SCHEMA = _a.struct([
    ['instruction', 'u8'],
    ['reveal', { kind: 'option', type: [bn_js_1.default, bn_js_1.default] }],
]);
class EndAuction extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { store, auction, auctionExtended, auctionManager, auctionManagerAuthority, reveal = null, } = params;
        const data = EndAuctionArgs.serialize({ reveal });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: auctionManager,
                    isSigner: false,
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
                    isWritable: false,
                },
                {
                    pubkey: auctionManagerAuthority,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: store,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: mpl_auction_1.AuctionProgram.PUBKEY,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: MetaplexProgram_1.MetaplexProgram.PUBKEY,
            data,
        }));
    }
}
exports.EndAuction = EndAuction;
//# sourceMappingURL=EndAuction.js.map