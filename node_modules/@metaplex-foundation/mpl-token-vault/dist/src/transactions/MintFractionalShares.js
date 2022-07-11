"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintFractionalShares = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const VaultProgram_1 = require("../VaultProgram");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const Vault_1 = require("../accounts/Vault");
const VaultProgram_2 = require("../VaultProgram");
class MintFractionalShares extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { vault, vaultAuthority, fractionMint, fractionTreasury, fractionMintAuthority, numberOfShares, } = params;
        const data = Vault_1.NumberOfShareArgs.serialize({
            instruction: VaultProgram_1.VaultInstructions.MintFractionalShares,
            numberOfShares,
        });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: fractionTreasury,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: fractionMint,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: vault,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: fractionMintAuthority,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: vaultAuthority,
                    isSigner: false,
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
exports.MintFractionalShares = MintFractionalShares;
//# sourceMappingURL=MintFractionalShares.js.map