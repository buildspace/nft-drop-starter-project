"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyCollection = exports.VerifyCollectionArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const MetadataProgram_1 = require("../MetadataProgram");
class VerifyCollectionArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 18;
    }
}
exports.VerifyCollectionArgs = VerifyCollectionArgs;
VerifyCollectionArgs.SCHEMA = new Map([...VerifyCollectionArgs.struct([['instruction', 'u8']])]);
class VerifyCollection extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { metadata, collectionAuthority, collectionMint, collectionMetadata, collectionMasterEdition, collectionAuthorityRecord, } = params;
        const data = VerifyCollectionArgs.serialize();
        const accounts = [
            {
                pubkey: metadata,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: collectionAuthority,
                isSigner: true,
                isWritable: true,
            },
            {
                pubkey: feePayer,
                isSigner: true,
                isWritable: true,
            },
            {
                pubkey: collectionMint,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: collectionMetadata,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: collectionMasterEdition,
                isSigner: false,
                isWritable: false,
            },
        ];
        if (collectionAuthorityRecord) {
            accounts.push({
                pubkey: collectionAuthorityRecord,
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
exports.VerifyCollection = VerifyCollection;
//# sourceMappingURL=VerifyCollection.js.map