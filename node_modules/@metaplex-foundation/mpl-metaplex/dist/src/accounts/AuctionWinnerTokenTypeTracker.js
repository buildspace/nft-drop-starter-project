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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionWinnerTokenTypeTracker = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer");
const MetaplexProgram_1 = require("../MetaplexProgram");
class AuctionWinnerTokenTypeTracker extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        if (!this.assertOwner(MetaplexProgram_1.MetaplexProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (!AuctionWinnerTokenTypeTracker.isCompatible(this.info.data)) {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
        this.data = deserialize(this.info.data);
    }
    static isCompatible(data) {
        return data[0] === MetaplexProgram_1.MetaplexKey.AuctionWinnerTokenTypeTrackerV1;
    }
    static getPDA(auctionManager) {
        return __awaiter(this, void 0, void 0, function* () {
            return MetaplexProgram_1.MetaplexProgram.findProgramAddress([
                buffer_1.Buffer.from(MetaplexProgram_1.MetaplexProgram.PREFIX),
                MetaplexProgram_1.MetaplexProgram.PUBKEY.toBuffer(),
                new web3_js_1.PublicKey(auctionManager).toBuffer(),
                buffer_1.Buffer.from(MetaplexProgram_1.MetaplexProgram.TOTALS),
            ]);
        });
    }
}
exports.AuctionWinnerTokenTypeTracker = AuctionWinnerTokenTypeTracker;
const deserialize = (buffer) => {
    const data = {
        key: MetaplexProgram_1.MetaplexKey.SafetyDepositConfigV1,
        amountType: buffer[1],
        lengthType: buffer[2],
        amountRanges: [],
    };
    const lengthOfArray = new bn_js_1.default(buffer.slice(3, 7), 'le');
    let offset = 7;
    for (let i = 0; i < lengthOfArray.toNumber(); i++) {
        const amount = (0, mpl_core_1.getBNFromData)(buffer, offset, data.amountType);
        offset += data.amountType;
        const length = (0, mpl_core_1.getBNFromData)(buffer, offset, data.lengthType);
        offset += data.lengthType;
        data.amountRanges.push({ amount, length });
    }
    return data;
};
//# sourceMappingURL=AuctionWinnerTokenTypeTracker.js.map