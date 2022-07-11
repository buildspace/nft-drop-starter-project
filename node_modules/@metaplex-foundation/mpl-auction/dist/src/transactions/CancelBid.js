"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelBid = exports.CancelBidArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const AuctionProgram_1 = require("../AuctionProgram");
class CancelBidArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 0;
    }
}
exports.CancelBidArgs = CancelBidArgs;
CancelBidArgs.SCHEMA = CancelBidArgs.struct([
    ['instruction', 'u8'],
    ['resource', 'pubkeyAsString'],
]);
class CancelBid extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { auction, auctionExtended, bidderPot, bidderMeta, bidder, bidderToken, bidderPotToken, tokenMint, resource, } = params;
        const data = CancelBidArgs.serialize({ resource: resource.toString() });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: bidder,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: bidderToken,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: bidderPot,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: bidderPotToken,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: bidderMeta,
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
                    isWritable: true,
                },
                {
                    pubkey: tokenMint,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY,
                    isSigner: false,
                    isWritable: false,
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
                {
                    pubkey: spl_token_1.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: AuctionProgram_1.AuctionProgram.PUBKEY,
            data,
        }));
    }
}
exports.CancelBid = CancelBid;
//# sourceMappingURL=CancelBid.js.map