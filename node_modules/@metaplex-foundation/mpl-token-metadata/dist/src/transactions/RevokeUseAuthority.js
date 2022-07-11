"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevokeUseAuthority = exports.RevokeUseAuthorityArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const MetadataProgram_1 = require("../MetadataProgram");
class RevokeUseAuthorityArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 21;
    }
}
exports.RevokeUseAuthorityArgs = RevokeUseAuthorityArgs;
RevokeUseAuthorityArgs.SCHEMA = new Map([...RevokeUseAuthorityArgs.struct([['instruction', 'u8']])]);
class RevokeUseAuthority extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { useAuthorityRecord, user, owner, ownerTokenAccount, metadata, mint } = params;
        const data = RevokeUseAuthorityArgs.serialize();
        const accounts = [
            {
                pubkey: useAuthorityRecord,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: owner,
                isSigner: true,
                isWritable: true,
            },
            {
                pubkey: user,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: ownerTokenAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: mint,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: metadata,
                isSigner: false,
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
        this.add(new web3_js_1.TransactionInstruction({
            keys: accounts,
            programId: MetadataProgram_1.MetadataProgram.PUBKEY,
            data,
        }));
    }
}
exports.RevokeUseAuthority = RevokeUseAuthority;
//# sourceMappingURL=RevokeUseAuthority.js.map