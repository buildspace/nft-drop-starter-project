"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawTokenFromSafetyDepositBox = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const VaultProgram_1 = require("../VaultProgram");
const Vault_1 = require("../accounts/Vault");
const VaultProgram_2 = require("../VaultProgram");
class WithdrawTokenFromSafetyDepositBox extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { vault, vaultAuthority, store, destination, fractionMint, transferAuthority, safetyDepositBox, amount, } = params;
        const data = Vault_1.AmountArgs.serialize({
            instruction: VaultProgram_1.VaultInstructions.WithdrawTokenFromSafetyDepositBox,
            amount,
        });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: destination,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: safetyDepositBox,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: store,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: vault,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: fractionMint,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: vaultAuthority,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: transferAuthority,
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
exports.WithdrawTokenFromSafetyDepositBox = WithdrawTokenFromSafetyDepositBox;
//# sourceMappingURL=WithdrawTokenFromSafetyDepositBox.js.map