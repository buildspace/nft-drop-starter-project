"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitVault = exports.InitVaultArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const VaultProgram_1 = require("../VaultProgram");
const VaultProgram_2 = require("../VaultProgram");
class InitVaultArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = VaultProgram_1.VaultInstructions.InitVault;
        this.allowFurtherShareCreation = false;
    }
}
exports.InitVaultArgs = InitVaultArgs;
_a = InitVaultArgs;
InitVaultArgs.SCHEMA = _a.struct([
    ['instruction', 'u8'],
    ['allowFurtherShareCreation', 'u8'],
]);
class InitVault extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { vault, vaultAuthority, fractionalMint, redeemTreasury, fractionalTreasury, pricingLookupAddress, allowFurtherShareCreation, } = params;
        const data = InitVaultArgs.serialize({ allowFurtherShareCreation });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: fractionalMint,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: redeemTreasury,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: fractionalTreasury,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: vault,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: vaultAuthority,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: pricingLookupAddress,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: spl_token_1.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: VaultProgram_2.VaultProgram.PUBKEY,
            data,
        }));
    }
}
exports.InitVault = InitVault;
//# sourceMappingURL=InitVault.js.map