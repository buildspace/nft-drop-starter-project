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
exports.SafetyDepositBox = exports.SafetyDepositBoxData = void 0;
const web3_js_1 = require("@solana/web3.js");
const VaultProgram_1 = require("../VaultProgram");
const buffer_1 = require("buffer");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
class SafetyDepositBoxData extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = VaultProgram_1.VaultKey.SafetyDepositBoxV1;
    }
}
exports.SafetyDepositBoxData = SafetyDepositBoxData;
_a = SafetyDepositBoxData;
SafetyDepositBoxData.SCHEMA = _a.struct([
    ['key', 'u8'],
    ['vault', 'pubkeyAsString'],
    ['tokenMint', 'pubkeyAsString'],
    ['store', 'pubkeyAsString'],
    ['order', 'u8'],
]);
class SafetyDepositBox extends mpl_core_1.Account {
    constructor(key, info) {
        super(key, info);
        if (!this.assertOwner(VaultProgram_1.VaultProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (!SafetyDepositBox.isCompatible(this.info.data)) {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
        this.data = SafetyDepositBoxData.deserialize(this.info.data);
    }
    static getPDA(vault, mint) {
        return __awaiter(this, void 0, void 0, function* () {
            return VaultProgram_1.VaultProgram.findProgramAddress([
                buffer_1.Buffer.from(VaultProgram_1.VaultProgram.PREFIX),
                new web3_js_1.PublicKey(vault).toBuffer(),
                new web3_js_1.PublicKey(mint).toBuffer(),
            ]);
        });
    }
    static isCompatible(data) {
        return data[0] === VaultProgram_1.VaultKey.SafetyDepositBoxV1;
    }
}
exports.SafetyDepositBox = SafetyDepositBox;
//# sourceMappingURL=SafetyDepositBox.js.map