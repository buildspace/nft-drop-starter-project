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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vault = exports.VaultData = exports.VaultState = exports.NumberOfShareArgs = exports.AmountArgs = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const SafetyDepositBox_1 = require("./SafetyDepositBox");
const VaultProgram_1 = require("../VaultProgram");
const buffer_1 = require("buffer");
class AmountArgs extends mpl_core_1.Borsh.Data {
}
exports.AmountArgs = AmountArgs;
_a = AmountArgs;
AmountArgs.SCHEMA = _a.struct([
    ['instruction', 'u8'],
    ['amount', 'u64'],
]);
class NumberOfShareArgs extends mpl_core_1.Borsh.Data {
}
exports.NumberOfShareArgs = NumberOfShareArgs;
_b = NumberOfShareArgs;
NumberOfShareArgs.SCHEMA = _b.struct([
    ['instruction', 'u8'],
    ['numberOfShares', 'u64'],
]);
var VaultState;
(function (VaultState) {
    VaultState[VaultState["Inactive"] = 0] = "Inactive";
    VaultState[VaultState["Active"] = 1] = "Active";
    VaultState[VaultState["Combined"] = 2] = "Combined";
    VaultState[VaultState["Deactivated"] = 3] = "Deactivated";
})(VaultState = exports.VaultState || (exports.VaultState = {}));
class VaultData extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = VaultProgram_1.VaultKey.VaultV1;
    }
}
exports.VaultData = VaultData;
_c = VaultData;
VaultData.SCHEMA = _c.struct([
    ['key', 'u8'],
    ['tokenProgram', 'pubkeyAsString'],
    ['fractionMint', 'pubkeyAsString'],
    ['authority', 'pubkeyAsString'],
    ['fractionTreasury', 'pubkeyAsString'],
    ['redeemTreasury', 'pubkeyAsString'],
    ['allowFurtherShareCreation', 'u8'],
    ['pricingLookupAddress', 'pubkeyAsString'],
    ['tokenTypeCount', 'u8'],
    ['state', 'u8'],
    ['lockedPricePerShare', 'u64'],
]);
class Vault extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        if (!this.assertOwner(VaultProgram_1.VaultProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (!Vault.isCompatible(this.info.data)) {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
        this.data = VaultData.deserialize(this.info.data);
    }
    static getPDA(pubkey) {
        return __awaiter(this, void 0, void 0, function* () {
            return VaultProgram_1.VaultProgram.findProgramAddress([
                buffer_1.Buffer.from(VaultProgram_1.VaultProgram.PREFIX),
                VaultProgram_1.VaultProgram.PUBKEY.toBuffer(),
                new web3_js_1.PublicKey(pubkey).toBuffer(),
            ]);
        });
    }
    static isCompatible(data) {
        return data[0] === VaultProgram_1.VaultKey.VaultV1;
    }
    getSafetyDepositBoxes(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield VaultProgram_1.VaultProgram.getProgramAccounts(connection, {
                filters: [
                    {
                        memcmp: {
                            offset: 0,
                            bytes: bs58_1.default.encode(buffer_1.Buffer.from([VaultProgram_1.VaultKey.SafetyDepositBoxV1])),
                        },
                    },
                    {
                        memcmp: {
                            offset: 1,
                            bytes: this.pubkey.toBase58(),
                        },
                    },
                ],
            })).map((account) => SafetyDepositBox_1.SafetyDepositBox.from(account));
        });
    }
}
exports.Vault = Vault;
Vault.MAX_VAULT_SIZE = 1 + 32 + 32 + 32 + 32 + 1 + 32 + 1 + 32 + 1 + 1 + 8;
Vault.MAX_EXTERNAL_ACCOUNT_SIZE = 1 + 8 + 32 + 1;
//# sourceMappingURL=Vault.js.map