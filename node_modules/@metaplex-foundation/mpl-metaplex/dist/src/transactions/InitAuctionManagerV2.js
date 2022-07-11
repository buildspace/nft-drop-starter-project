"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitAuctionManagerV2 = exports.InitAuctionManagerV2Args = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const MetaplexProgram_1 = require("../MetaplexProgram");
class InitAuctionManagerV2Args extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 17;
        this.amountType = mpl_core_1.TupleNumericType.U8;
        this.lengthType = mpl_core_1.TupleNumericType.U8;
        this.maxRanges = new bn_js_1.default(1);
    }
}
exports.InitAuctionManagerV2Args = InitAuctionManagerV2Args;
_a = InitAuctionManagerV2Args;
InitAuctionManagerV2Args.SCHEMA = _a.struct([
    ['instruction', 'u8'],
    ['amountType', 'u8'],
    ['lengthType', 'u8'],
    ['maxRanges', 'u64'],
]);
class InitAuctionManagerV2 extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { store, vault, auction, auctionManager, auctionManagerAuthority, acceptPaymentAccount, tokenTracker, amountType, lengthType, maxRanges, } = params;
        const data = InitAuctionManagerV2Args.serialize({ amountType, lengthType, maxRanges });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: auctionManager,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: tokenTracker,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: vault,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: auction,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: auctionManagerAuthority,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: feePayer,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: acceptPaymentAccount,
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
            ],
            programId: MetaplexProgram_1.MetaplexProgram.PUBKEY,
            data,
        }));
    }
}
exports.InitAuctionManagerV2 = InitAuctionManagerV2;
//# sourceMappingURL=InitAuctionManagerV2.js.map