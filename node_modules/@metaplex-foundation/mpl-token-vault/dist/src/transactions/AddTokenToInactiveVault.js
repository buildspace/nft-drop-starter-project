"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTokenToInactiveVault = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const Vault_1 = require("../accounts/Vault");
const VaultProgram_1 = require("../VaultProgram");
const VaultProgram_2 = require("../VaultProgram");
class AddTokenToInactiveVault extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { vault, vaultAuthority, tokenAccount, tokenStoreAccount, transferAuthority, safetyDepositBox, amount, } = params;
        const data = Vault_1.AmountArgs.serialize({
            instruction: VaultProgram_2.VaultInstructions.AddTokenToInactiveVault,
            amount,
        });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: safetyDepositBox,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: tokenAccount,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: tokenStoreAccount,
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
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: feePayer,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: transferAuthority,
                    isSigner: true,
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
                {
                    pubkey: web3_js_1.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: VaultProgram_1.VaultProgram.PUBKEY,
            data,
        }));
    }
}
exports.AddTokenToInactiveVault = AddTokenToInactiveVault;
//# sourceMappingURL=AddTokenToInactiveVault.js.map