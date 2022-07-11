"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalPriceAccount = exports.ExternalPriceAccountData = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const VaultProgram_1 = require("../VaultProgram");
class ExternalPriceAccountData extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = VaultProgram_1.VaultKey.ExternalPriceAccountV1;
    }
}
exports.ExternalPriceAccountData = ExternalPriceAccountData;
_a = ExternalPriceAccountData;
ExternalPriceAccountData.SCHEMA = _a.struct([
    ['key', 'u8'],
    ['pricePerShare', 'u64'],
    ['priceMint', 'pubkeyAsString'],
    ['allowedToCombine', 'u8'],
]);
class ExternalPriceAccount extends mpl_core_1.Account {
    constructor(key, info) {
        super(key, info);
        if (!this.assertOwner(VaultProgram_1.VaultProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (!ExternalPriceAccount.isCompatible(this.info.data)) {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
        this.data = ExternalPriceAccountData.deserialize(this.info.data);
    }
    static isCompatible(data) {
        return data[0] === VaultProgram_1.VaultKey.ExternalPriceAccountV1;
    }
}
exports.ExternalPriceAccount = ExternalPriceAccount;
//# sourceMappingURL=ExternalPriceAccount.js.map