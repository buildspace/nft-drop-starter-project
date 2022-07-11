"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrizeTrackingTicket = exports.PrizeTrackingTicketData = void 0;
const web3_js_1 = require("@solana/web3.js");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const MetaplexProgram_1 = require("../MetaplexProgram");
const buffer_1 = require("buffer");
class PrizeTrackingTicketData extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = MetaplexProgram_1.MetaplexKey.PrizeTrackingTicketV1;
        this.key = MetaplexProgram_1.MetaplexKey.PrizeTrackingTicketV1;
    }
}
exports.PrizeTrackingTicketData = PrizeTrackingTicketData;
_a = PrizeTrackingTicketData;
PrizeTrackingTicketData.SCHEMA = _a.struct([
    ['key', 'u8'],
    ['metadata', 'pubkeyAsString'],
    ['supplySnapshot', 'u64'],
    ['expectedRedemptions', 'u64'],
    ['redemptions', 'u64'],
]);
class PrizeTrackingTicket extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        if (!this.assertOwner(MetaplexProgram_1.MetaplexProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (!PrizeTrackingTicket.isCompatible(this.info.data)) {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
        this.data = PrizeTrackingTicketData.deserialize(this.info.data);
    }
    static isCompatible(data) {
        return data[0] === MetaplexProgram_1.MetaplexKey.PrizeTrackingTicketV1;
    }
    static getPDA(auctionManager, mint) {
        return __awaiter(this, void 0, void 0, function* () {
            return MetaplexProgram_1.MetaplexProgram.findProgramAddress([
                buffer_1.Buffer.from(MetaplexProgram_1.MetaplexProgram.PREFIX),
                MetaplexProgram_1.MetaplexProgram.PUBKEY.toBuffer(),
                new web3_js_1.PublicKey(auctionManager).toBuffer(),
                new web3_js_1.PublicKey(mint).toBuffer(),
            ]);
        });
    }
}
exports.PrizeTrackingTicket = PrizeTrackingTicket;
//# sourceMappingURL=PrizeTrackingTicket.js.map