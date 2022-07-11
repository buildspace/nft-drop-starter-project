"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivateVault = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const VaultProgram_1 = require("../VaultProgram");
const Vault_1 = require("../accounts/Vault");
const VaultProgram_2 = require("../VaultProgram");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
class ActivateVault extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { vault, vaultAuthority, fractionMint, fractionTreasury, fractionMintAuthority, numberOfShares, } = params;
        const data = Vault_1.NumberOfShareArgs.serialize({
            instruction: VaultProgram_1.VaultInstructions.ActivateVault,
            numberOfShares,
        });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
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
                    pubkey: fractionTreasury,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: fractionMintAuthority,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: vaultAuthority,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: spl_token_1.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: VaultProgram_2.VaultProgram.PUBKEY,
            data,
        }));
    }
}
exports.ActivateVault = ActivateVault;
//# sourceMappingURL=ActivateVault.js.map