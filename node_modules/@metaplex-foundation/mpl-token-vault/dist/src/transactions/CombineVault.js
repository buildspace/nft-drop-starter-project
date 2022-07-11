"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombineVault = exports.CombineVaultArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const VaultProgram_1 = require("../VaultProgram");
const VaultProgram_2 = require("../VaultProgram");
class CombineVaultArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = VaultProgram_1.VaultInstructions.CombineVault;
    }
}
exports.CombineVaultArgs = CombineVaultArgs;
_a = CombineVaultArgs;
CombineVaultArgs.SCHEMA = _a.struct([['instruction', 'u8']]);
class CombineVault extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { vault, vaultAuthority, fractionMint, fractionTreasury, outstandingShareTokenAccount, payingTokenAccount, redeemTreasury, newVaultAuthority, transferAuthority, externalPriceAccount, burnAuthority, } = params;
        const data = CombineVaultArgs.serialize();
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: vault,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: outstandingShareTokenAccount,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: payingTokenAccount,
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
                    pubkey: redeemTreasury,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: newVaultAuthority || vaultAuthority,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: vaultAuthority,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: transferAuthority,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: burnAuthority,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: externalPriceAccount,
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
exports.CombineVault = CombineVault;
//# sourceMappingURL=CombineVault.js.map