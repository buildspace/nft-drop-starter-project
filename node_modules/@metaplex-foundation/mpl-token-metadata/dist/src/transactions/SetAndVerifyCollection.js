"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetAndVerifyCollectionCollection = exports.SetAndVerifyCollectionArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const MetadataProgram_1 = require("../MetadataProgram");
class SetAndVerifyCollectionArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 25;
    }
}
exports.SetAndVerifyCollectionArgs = SetAndVerifyCollectionArgs;
SetAndVerifyCollectionArgs.SCHEMA = new Map([...SetAndVerifyCollectionArgs.struct([['instruction', 'u8']])]);
class SetAndVerifyCollectionCollection extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { metadata, collectionAuthority, collectionMint, updateAuthority, collectionMetadata, collectionMasterEdition, collectionAuthorityRecord, } = params;
        const data = SetAndVerifyCollectionArgs.serialize();
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
                pubkey: updateAuthority,
                isSigner: false,
                isWritable: false,
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
exports.SetAndVerifyCollectionCollection = SetAndVerifyCollectionCollection;
//# sourceMappingURL=SetAndVerifyCollection.js.map