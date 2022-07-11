"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidderMetadata = exports.BidderMetadataData = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const AuctionProgram_1 = require("../AuctionProgram");
const buffer_1 = require("buffer");
class BidderMetadataData extends mpl_core_1.Borsh.Data {
}
exports.BidderMetadataData = BidderMetadataData;
BidderMetadataData.SCHEMA = BidderMetadataData.struct([
    ['bidderPubkey', 'pubkeyAsString'],
    ['auctionPubkey', 'pubkeyAsString'],
    ['lastBid', 'u64'],
    ['lastBidTimestamp', 'u64'],
    ['cancelled', 'u8'],
]);
class BidderMetadata extends mpl_core_1.Account {
    constructor(key, info) {
        super(key, info);
        if (!this.assertOwner(AuctionProgram_1.AuctionProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (!BidderMetadata.isCompatible(this.info.data)) {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
        this.data = BidderMetadataData.deserialize(this.info.data);
    }
    static isCompatible(data) {
        return data.length === BidderMetadata.DATA_SIZE;
    }
    static getPDA(auction, bidder) {
        return AuctionProgram_1.AuctionProgram.findProgramAddress([
            buffer_1.Buffer.from(AuctionProgram_1.AuctionProgram.PREFIX),
            AuctionProgram_1.AuctionProgram.PUBKEY.toBuffer(),
            new web3_js_1.PublicKey(auction).toBuffer(),
            new web3_js_1.PublicKey(bidder).toBuffer(),
            buffer_1.Buffer.from('metadata'),
        ]);
    }
}
exports.BidderMetadata = BidderMetadata;
BidderMetadata.DATA_SIZE = 32 + 32 + 8 + 8 + 1;
//# sourceMappingURL=BidderMetadata.js.map