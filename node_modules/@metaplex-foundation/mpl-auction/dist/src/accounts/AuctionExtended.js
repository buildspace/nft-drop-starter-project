"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionExtended = exports.AuctionDataExtended = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const AuctionProgram_1 = require("../AuctionProgram");
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
class AuctionDataExtended extends mpl_core_1.Borsh.Data {
}
exports.AuctionDataExtended = AuctionDataExtended;
AuctionDataExtended.SCHEMA = AuctionDataExtended.struct([
    ['totalUncancelledBids', 'u64'],
    ['tickSize', { kind: 'option', type: 'u64' }],
    ['gapTickSizePercentage', { kind: 'option', type: 'u8' }],
    ['instantSalePrice', { kind: 'option', type: 'u64' }],
    ['name', { kind: 'option', type: [32] }],
]);
class AuctionExtended extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        if (!this.assertOwner(AuctionProgram_1.AuctionProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (!AuctionExtended.isCompatible(this.info.data)) {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
        this.data = AuctionDataExtended.deserialize(this.info.data);
    }
    static isCompatible(data) {
        return data.length === AuctionExtended.DATA_SIZE;
    }
    static getPDA(vault) {
        return AuctionProgram_1.AuctionProgram.findProgramAddress([
            buffer_1.Buffer.from(AuctionProgram_1.AuctionProgram.PREFIX),
            AuctionProgram_1.AuctionProgram.PUBKEY.toBuffer(),
            new web3_js_1.PublicKey(vault).toBuffer(),
            buffer_1.Buffer.from(AuctionProgram_1.AuctionProgram.EXTENDED),
        ]);
    }
}
exports.AuctionExtended = AuctionExtended;
AuctionExtended.DATA_SIZE = 8 + 9 + 2 + 200;
//# sourceMappingURL=AuctionExtended.js.map