"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevokeCollectionAuthority = exports.RevokeCollectionAuthorityArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const MetadataProgram_1 = require("../MetadataProgram");
class RevokeCollectionAuthorityArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 24;
    }
}
exports.RevokeCollectionAuthorityArgs = RevokeCollectionAuthorityArgs;
RevokeCollectionAuthorityArgs.SCHEMA = new Map([
    ...RevokeCollectionAuthorityArgs.struct([['instruction', 'u8']]),
]);
class RevokeCollectionAuthority extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { metadata, collectionAuthorityRecord, delegateAuthority, newCollectionAuthority, updateAuthority, mint, } = params;
        const delegatedAuth = delegateAuthority || newCollectionAuthority;
        if (!delegatedAuth) {
            throw new Error('Must provide either a delegateAuthority');
        }
        const data = RevokeCollectionAuthorityArgs.serialize();
        const accounts = [
            {
                pubkey: collectionAuthorityRecord,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: delegatedAuth,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: updateAuthority,
                isSigner: true,
                isWritable: false,
            },
            {
                pubkey: metadata,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: mint,
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
exports.RevokeCollectionAuthority = RevokeCollectionAuthority;
//# sourceMappingURL=RevokeCollectionAuthority.js.map