"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimBid = exports.ClaimBidArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const mpl_auction_1 = require("@metaplex-foundation/mpl-auction");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const MetaplexProgram_1 = require("../MetaplexProgram");
class ClaimBidArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 6;
    }
}
exports.ClaimBidArgs = ClaimBidArgs;
_a = ClaimBidArgs;
ClaimBidArgs.SCHEMA = _a.struct([['instruction', 'u8']]);
class ClaimBid extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { store, vault, auction, auctionExtended, auctionManager, bidder, bidderPot, bidderPotToken, acceptPayment, tokenMint, } = params;
        const data = ClaimBidArgs.serialize();
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: acceptPayment,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: bidderPotToken,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: bidderPot,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: auctionManager,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: auction,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: bidder,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: tokenMint,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: vault,
                    isSigner: false,
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
                {
                    pubkey: spl_token_1.TOKEN_PROGRAM_ID,
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
exports.ClaimBid = ClaimBid;
//# sourceMappingURL=ClaimBid.js.map