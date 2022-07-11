"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMetadata = exports.CreateMetadataArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const Metadata_1 = require("../accounts/Metadata");
const MetadataProgram_1 = require("../MetadataProgram");
class CreateMetadataArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 0;
    }
}
exports.CreateMetadataArgs = CreateMetadataArgs;
CreateMetadataArgs.SCHEMA = new Map([
    ...Metadata_1.MetadataDataData.SCHEMA,
    ...CreateMetadataArgs.struct([
        ['instruction', 'u8'],
        ['data', Metadata_1.MetadataDataData],
        ['isMutable', 'u8'],
    ]),
]);
class CreateMetadata extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { metadata, metadataData, updateAuthority, mint, mintAuthority } = params;
        const data = CreateMetadataArgs.serialize({
            data: metadataData,
            isMutable: true,
        });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: metadata,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: mint,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: mintAuthority,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: feePayer,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: updateAuthority,
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
            ],
            programId: MetadataProgram_1.MetadataProgram.PUBKEY,
            data,
        }));
    }
}
exports.CreateMetadata = CreateMetadata;
//# sourceMappingURL=CreateMetadata.js.map