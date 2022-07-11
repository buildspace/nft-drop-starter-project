"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemShares = exports.RedeemSharesArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const VaultProgram_1 = require("../VaultProgram");
const VaultProgram_2 = require("../VaultProgram");
class RedeemSharesArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = VaultProgram_1.VaultInstructions.RedeemShares;
    }
}
exports.RedeemSharesArgs = RedeemSharesArgs;
_a = RedeemSharesArgs;
RedeemSharesArgs.SCHEMA = _a.struct([['instruction', 'u8']]);
class RedeemShares extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { vault, burnAuthority, fractionMint, outstandingSharesAccount, proceedsAccount, redeemTreasury, transferAuthority, } = params;
        const data = RedeemSharesArgs.serialize();
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: outstandingSharesAccount,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: proceedsAccount,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: fractionMint,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: redeemTreasury,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: transferAuthority,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: burnAuthority,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: vault,
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
exports.RedeemShares = RedeemShares;
//# sourceMappingURL=RedeemShares.js.map