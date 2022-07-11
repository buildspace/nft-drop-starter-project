"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetVaultAuthority = exports.SetVaultAuthorityArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const VaultProgram_1 = require("../VaultProgram");
const VaultProgram_2 = require("../VaultProgram");
class SetVaultAuthorityArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = VaultProgram_1.VaultInstructions.SetVaultAuthority;
    }
}
exports.SetVaultAuthorityArgs = SetVaultAuthorityArgs;
_a = SetVaultAuthorityArgs;
SetVaultAuthorityArgs.SCHEMA = _a.struct([['instruction', 'u8']]);
class SetVaultAuthority extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { vault, currentAuthority, newAuthority } = params;
        const data = SetVaultAuthorityArgs.serialize();
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: vault,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: currentAuthority,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: newAuthority,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: VaultProgram_2.VaultProgram.PUBKEY,
            data,
        }));
    }
}
exports.SetVaultAuthority = SetVaultAuthority;
//# sourceMappingURL=SetVaultAuthority.js.map