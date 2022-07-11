"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveCollectionAuthority = exports.ApproveCollectionAuthorityArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const MetadataProgram_1 = require("../MetadataProgram");
class ApproveCollectionAuthorityArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 23;
    }
}
exports.ApproveCollectionAuthorityArgs = ApproveCollectionAuthorityArgs;
ApproveCollectionAuthorityArgs.SCHEMA = new Map([
    ...ApproveCollectionAuthorityArgs.struct([['instruction', 'u8']]),
]);
class ApproveCollectionAuthority extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { metadata, collectionAuthorityRecord, newCollectionAuthority, updateAuthority, mint } = params;
        const data = ApproveCollectionAuthorityArgs.serialize();
        const accounts = [
            {
                pubkey: collectionAuthorityRecord,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: newCollectionAuthority,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: updateAuthority,
                isSigner: true,
                isWritable: false,
            },
            {
                pubkey: feePayer,
                isSigner: true,
                isWritable: true,
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
exports.ApproveCollectionAuthority = ApproveCollectionAuthority;
//# sourceMappingURL=ApproveCollectionAuthority.js.map