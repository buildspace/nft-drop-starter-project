"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartAuction = exports.StartAuctionArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const mpl_auction_1 = require("@metaplex-foundation/mpl-auction");
const MetaplexProgram_1 = require("../MetaplexProgram");
class StartAuctionArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 5;
    }
}
exports.StartAuctionArgs = StartAuctionArgs;
_a = StartAuctionArgs;
StartAuctionArgs.SCHEMA = _a.struct([['instruction', 'u8']]);
class StartAuction extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { store, auction, auctionManager, auctionManagerAuthority } = params;
        const data = StartAuctionArgs.serialize();
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
exports.StartAuction = StartAuction;
//# sourceMappingURL=StartAuction.js.map