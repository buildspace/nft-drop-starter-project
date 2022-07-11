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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutTicket = exports.PayoutTicketData = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const MetaplexProgram_1 = require("../MetaplexProgram");
const buffer_1 = require("buffer");
class PayoutTicketData extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = MetaplexProgram_1.MetaplexKey.PayoutTicketV1;
    }
}
exports.PayoutTicketData = PayoutTicketData;
_a = PayoutTicketData;
PayoutTicketData.SCHEMA = _a.struct([
    ['key', 'u8'],
    ['recipient', 'pubkeyAsString'],
    ['amountPaid', 'u64'],
]);
class PayoutTicket extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        if (!this.assertOwner(MetaplexProgram_1.MetaplexProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (!PayoutTicket.isCompatible(this.info.data)) {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
        this.data = PayoutTicketData.deserialize(this.info.data);
    }
    static isCompatible(data) {
        return data[0] === MetaplexProgram_1.MetaplexKey.PayoutTicketV1;
    }
    static getPayoutTicketsByRecipient(connection, recipient) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield MetaplexProgram_1.MetaplexProgram.getProgramAccounts(connection, {
                filters: [
                    {
                        memcmp: {
                            offset: 0,
                            bytes: bs58_1.default.encode(buffer_1.Buffer.from([MetaplexProgram_1.MetaplexKey.PayoutTicketV1])),
                        },
                    },
                    {
                        memcmp: {
                            offset: 1,
                            bytes: new web3_js_1.PublicKey(recipient).toBase58(),
                        },
                    },
                ],
            })).map((account) => PayoutTicket.from(account));
        });
    }
}
exports.PayoutTicket = PayoutTicket;
//# sourceMappingURL=PayoutTicket.js.map