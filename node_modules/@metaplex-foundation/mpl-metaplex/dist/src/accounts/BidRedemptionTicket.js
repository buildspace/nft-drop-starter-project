"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidRedemptionTicket = exports.WINNER_INDEX_OFFSETS = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const bs58_1 = __importDefault(require("bs58"));
const MetaplexProgram_1 = require("../MetaplexProgram");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
exports.WINNER_INDEX_OFFSETS = [2, 10];
class BidRedemptionTicket extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        if (!this.assertOwner(MetaplexProgram_1.MetaplexProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (BidRedemptionTicket.isBidRedemptionTicketV1(this.info.data)) {
            throw (0, mpl_core_1.ERROR_DEPRECATED_ACCOUNT_DATA)();
        }
        else if (BidRedemptionTicket.isBidRedemptionTicketV2(this.info.data)) {
            const data = this.info.data.toJSON().data;
            const winnerIndex = data[1] !== 0 && new bn_js_1.default(data.slice(1, 9), 'le');
            const offset = exports.WINNER_INDEX_OFFSETS[+!!winnerIndex];
            this.data = {
                key: MetaplexProgram_1.MetaplexKey.BidRedemptionTicketV2,
                winnerIndex,
                data,
                auctionManager: bs58_1.default.encode(data.slice(offset, offset + 32)),
            };
        }
        else {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
    }
    static isCompatible(data) {
        return (BidRedemptionTicket.isBidRedemptionTicketV1(data) ||
            BidRedemptionTicket.isBidRedemptionTicketV2(data));
    }
    static isBidRedemptionTicketV1(data) {
        return data[0] === MetaplexProgram_1.MetaplexKey.BidRedemptionTicketV1;
    }
    static isBidRedemptionTicketV2(data) {
        return data[0] === MetaplexProgram_1.MetaplexKey.BidRedemptionTicketV2;
    }
}
exports.BidRedemptionTicket = BidRedemptionTicket;
//# sourceMappingURL=BidRedemptionTicket.js.map