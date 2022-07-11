"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreezeDelegatedAccount = exports.FreezeDelegatedAccountArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const MetadataProgram_1 = require("../MetadataProgram");
const spl_token_1 = require("@solana/spl-token");
class FreezeDelegatedAccountArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 26;
    }
}
exports.FreezeDelegatedAccountArgs = FreezeDelegatedAccountArgs;
FreezeDelegatedAccountArgs.SCHEMA = new Map([...FreezeDelegatedAccountArgs.struct([['instruction', 'u8']])]);
class FreezeDelegatedAccount extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { delegate, token_account, edition, mint } = params;
        const data = FreezeDelegatedAccountArgs.serialize();
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: delegate,
                    isSigner: true,
                    isWritable: true,
                },
                {
                    pubkey: token_account,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: edition,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: mint,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: spl_token_1.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: MetadataProgram_1.MetadataProgram.PUBKEY,
            data,
        }));
    }
}
exports.FreezeDelegatedAccount = FreezeDelegatedAccount;
//# sourceMappingURL=FreezeDelegatedAccount.js.map