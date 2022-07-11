"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utilize = exports.UtilizeArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const MetadataProgram_1 = require("../MetadataProgram");
class UtilizeArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 19;
    }
}
exports.UtilizeArgs = UtilizeArgs;
UtilizeArgs.SCHEMA = new Map([
    ...UtilizeArgs.struct([
        ['instruction', 'u8'],
        ['numberOfUses', 'u8'],
    ]),
]);
class Utilize extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { metadata, useAuthority, numberOfUses, burner, tokenAccount } = params;
        const data = UtilizeArgs.serialize({ numberOfUses });
        const accounts = [
            {
                pubkey: metadata,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: tokenAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: useAuthority,
                isSigner: true,
                isWritable: false,
            },
            {
                pubkey: spl_token_1.TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: web3_js_1.SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
                isSigner: false,
                isWritable: false,
            },
        ];
        if (useAuthority) {
            accounts.push({
                pubkey: useAuthority,
                isSigner: false,
                isWritable: false,
            });
            accounts.push({
                pubkey: burner,
                isSigner: false,
                isWritable: false,
            });
        }
        this.add(new web3_js_1.TransactionInstruction({
            keys: accounts,
            programId: MetadataProgram_1.MetadataProgram.PUBKEY,
            data,
        }));
    }
}
exports.Utilize = Utilize;
//# sourceMappingURL=Utilize.js.map