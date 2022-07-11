"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionProgram = void 0;
const web3_js_1 = require("@solana/web3.js");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
class AuctionProgram extends mpl_core_1.Program {
}
exports.AuctionProgram = AuctionProgram;
AuctionProgram.PREFIX = 'auction';
AuctionProgram.EXTENDED = 'extended';
AuctionProgram.PUBKEY = new web3_js_1.PublicKey(mpl_core_1.config.programs.auction);
//# sourceMappingURL=AuctionProgram.js.map