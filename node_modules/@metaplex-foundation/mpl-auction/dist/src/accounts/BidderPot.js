"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidderPot = exports.BidderPotData = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const AuctionProgram_1 = require("../AuctionProgram");
const web3_js_1 = require("@solana/web3.js");
const buffer_1 = require("buffer");
class BidderPotData extends mpl_core_1.Borsh.Data {
}
exports.BidderPotData = BidderPotData;
BidderPotData.SCHEMA = BidderPotData.struct([
    ['bidderPot', 'pubkeyAsString'],
    ['bidderAct', 'pubkeyAsString'],
    ['auctionAct', 'pubkeyAsString'],
    ['emptied', 'u8'],
]);
class BidderPot extends mpl_core_1.Account {
    constructor(key, info) {
        super(key, info);
        if (!this.assertOwner(AuctionProgram_1.AuctionProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (!BidderPot.isCompatible(this.info.data)) {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
        this.data = BidderPotData.deserialize(this.info.data);
    }
    static isCompatible(data) {
        return data.length === BidderPot.DATA_SIZE;
    }
    static getPDA(auction, bidder) {
        return AuctionProgram_1.AuctionProgram.findProgramAddress([
            buffer_1.Buffer.from(AuctionProgram_1.AuctionProgram.PREFIX),
            AuctionProgram_1.AuctionProgram.PUBKEY.toBuffer(),
            new web3_js_1.PublicKey(auction).toBuffer(),
            new web3_js_1.PublicKey(bidder).toBuffer(),
        ]);
    }
}
exports.BidderPot = BidderPot;
BidderPot.DATA_SIZE = 32 + 32 + 32 + 1;
//# sourceMappingURL=BidderPot.js.map