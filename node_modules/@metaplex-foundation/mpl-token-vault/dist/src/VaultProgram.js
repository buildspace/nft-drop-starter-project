"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultProgram = exports.VaultInstructions = exports.VaultKey = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
var VaultKey;
(function (VaultKey) {
    VaultKey[VaultKey["Uninitialized"] = 0] = "Uninitialized";
    VaultKey[VaultKey["VaultV1"] = 3] = "VaultV1";
    VaultKey[VaultKey["SafetyDepositBoxV1"] = 1] = "SafetyDepositBoxV1";
    VaultKey[VaultKey["ExternalPriceAccountV1"] = 2] = "ExternalPriceAccountV1";
})(VaultKey = exports.VaultKey || (exports.VaultKey = {}));
var VaultInstructions;
(function (VaultInstructions) {
    VaultInstructions[VaultInstructions["InitVault"] = 0] = "InitVault";
    VaultInstructions[VaultInstructions["AddTokenToInactiveVault"] = 1] = "AddTokenToInactiveVault";
    VaultInstructions[VaultInstructions["ActivateVault"] = 2] = "ActivateVault";
    VaultInstructions[VaultInstructions["CombineVault"] = 3] = "CombineVault";
    VaultInstructions[VaultInstructions["RedeemShares"] = 4] = "RedeemShares";
    VaultInstructions[VaultInstructions["WithdrawTokenFromSafetyDepositBox"] = 5] = "WithdrawTokenFromSafetyDepositBox";
    VaultInstructions[VaultInstructions["MintFractionalShares"] = 6] = "MintFractionalShares";
    VaultInstructions[VaultInstructions["WithdrawSharesFromTreasury"] = 7] = "WithdrawSharesFromTreasury";
    VaultInstructions[VaultInstructions["AddSharesToTreasury"] = 8] = "AddSharesToTreasury";
    VaultInstructions[VaultInstructions["UpdateExternalPriceAccount"] = 9] = "UpdateExternalPriceAccount";
    VaultInstructions[VaultInstructions["SetVaultAuthority"] = 10] = "SetVaultAuthority";
})(VaultInstructions = exports.VaultInstructions || (exports.VaultInstructions = {}));
class VaultProgram extends mpl_core_1.Program {
}
exports.VaultProgram = VaultProgram;
VaultProgram.PREFIX = 'vault';
VaultProgram.PUBKEY = new web3_js_1.PublicKey(mpl_core_1.config.programs.vault);
//# sourceMappingURL=VaultProgram.js.map