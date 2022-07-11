"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawSharesFromTreasury = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const VaultProgram_1 = require("../VaultProgram");
const Vault_1 = require("../accounts/Vault");
const VaultProgram_2 = require("../VaultProgram");
class WithdrawSharesFromTreasury extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { vault, vaultAuthority, destination, transferAuthority, fractionTreasury, numberOfShares, } = params;
        const data = Vault_1.NumberOfShareArgs.serialize({
            instruction: VaultProgram_1.VaultInstructions.WithdrawSharesFromTreasury,
            numberOfShares,
        });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: destination,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: fractionTreasury,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: vault,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: transferAuthority,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: vaultAuthority,
                    isSigner: false,
                    isWritable: true,
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
exports.WithdrawSharesFromTreasury = WithdrawSharesFromTreasury;
//# sourceMappingURL=WithdrawSharesFromTreasury.js.map