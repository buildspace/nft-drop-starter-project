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
exports.SafetyDepositConfig = exports.NonWinningConstraint = exports.WinningConstraint = exports.WinningConfigType = void 0;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const bs58_1 = __importDefault(require("bs58"));
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const MetaplexProgram_1 = require("../MetaplexProgram");
const buffer_1 = require("buffer");
var WinningConfigType;
(function (WinningConfigType) {
    WinningConfigType[WinningConfigType["TokenOnlyTransfer"] = 0] = "TokenOnlyTransfer";
    WinningConfigType[WinningConfigType["FullRightsTransfer"] = 1] = "FullRightsTransfer";
    WinningConfigType[WinningConfigType["PrintingV1"] = 2] = "PrintingV1";
    WinningConfigType[WinningConfigType["PrintingV2"] = 3] = "PrintingV2";
    WinningConfigType[WinningConfigType["Participation"] = 4] = "Participation";
})(WinningConfigType = exports.WinningConfigType || (exports.WinningConfigType = {}));
var WinningConstraint;
(function (WinningConstraint) {
    WinningConstraint[WinningConstraint["NoParticipationPrize"] = 0] = "NoParticipationPrize";
    WinningConstraint[WinningConstraint["ParticipationPrizeGiven"] = 1] = "ParticipationPrizeGiven";
})(WinningConstraint = exports.WinningConstraint || (exports.WinningConstraint = {}));
var NonWinningConstraint;
(function (NonWinningConstraint) {
    NonWinningConstraint[NonWinningConstraint["NoParticipationPrize"] = 0] = "NoParticipationPrize";
    NonWinningConstraint[NonWinningConstraint["GivenForFixedPrice"] = 1] = "GivenForFixedPrice";
    NonWinningConstraint[NonWinningConstraint["GivenForBidPrice"] = 2] = "GivenForBidPrice";
})(NonWinningConstraint = exports.NonWinningConstraint || (exports.NonWinningConstraint = {}));
class SafetyDepositConfig extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        if (!this.assertOwner(MetaplexProgram_1.MetaplexProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (!SafetyDepositConfig.isCompatible(this.info.data)) {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
        this.data = deserialize(this.info.data);
    }
    static isCompatible(data) {
        return data[0] === MetaplexProgram_1.MetaplexKey.SafetyDepositConfigV1;
    }
    static getPDA(auctionManager, safetyDeposit) {
        return __awaiter(this, void 0, void 0, function* () {
            return MetaplexProgram_1.MetaplexProgram.findProgramAddress([
                buffer_1.Buffer.from(MetaplexProgram_1.MetaplexProgram.PREFIX),
                MetaplexProgram_1.MetaplexProgram.PUBKEY.toBuffer(),
                new web3_js_1.PublicKey(auctionManager).toBuffer(),
                new web3_js_1.PublicKey(safetyDeposit).toBuffer(),
            ]);
        });
    }
}
exports.SafetyDepositConfig = SafetyDepositConfig;
const deserialize = (buffer) => {
    const data = {
        key: MetaplexProgram_1.MetaplexKey.SafetyDepositConfigV1,
        auctionManager: bs58_1.default.encode(buffer.slice(1, 33)),
        order: new bn_js_1.default(buffer.slice(33, 41), 'le'),
        winningConfigType: buffer[41],
        amountType: buffer[42],
        lengthType: buffer[43],
        amountRanges: [],
        participationConfig: null,
        participationState: null,
    };
    const lengthOfArray = new bn_js_1.default(buffer.slice(44, 48), 'le');
    let offset = 48;
    for (let i = 0; i < lengthOfArray.toNumber(); i++) {
        const amount = (0, mpl_core_1.getBNFromData)(buffer, offset, data.amountType);
        offset += data.amountType;
        const length = (0, mpl_core_1.getBNFromData)(buffer, offset, data.lengthType);
        offset += data.lengthType;
        data.amountRanges.push({ amount, length });
    }
    if (buffer[offset] == 0) {
        offset += 1;
        data.participationConfig = null;
    }
    else {
        const winnerConstraint = buffer[offset + 1];
        const nonWinningConstraint = buffer[offset + 2];
        let fixedPrice = null;
        offset += 3;
        if (buffer[offset] == 1) {
            fixedPrice = new bn_js_1.default(buffer.slice(offset + 1, offset + 9), 'le');
            offset += 9;
        }
        else {
            offset += 1;
        }
        data.participationConfig = {
            winnerConstraint,
            nonWinningConstraint,
            fixedPrice,
        };
    }
    if (buffer[offset] == 0) {
        offset += 1;
        data.participationState = null;
    }
    else {
        const collectedToAcceptPayment = new bn_js_1.default(buffer.slice(offset + 1, offset + 9), 'le');
        offset += 9;
        data.participationState = {
            collectedToAcceptPayment,
        };
    }
    return data;
};
//# sourceMappingURL=SafetyDepositConfig.js.map