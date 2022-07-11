"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMetadataV2 = exports.CreateMetadataV2Args = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const Metadata_1 = require("../accounts/Metadata");
const MetadataProgram_1 = require("../MetadataProgram");
class CreateMetadataV2Args extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 16;
    }
}
exports.CreateMetadataV2Args = CreateMetadataV2Args;
CreateMetadataV2Args.SCHEMA = new Map([
    ...Metadata_1.DataV2.SCHEMA,
    ...CreateMetadataV2Args.struct([
        ['instruction', 'u8'],
        ['data', Metadata_1.DataV2],
        ['isMutable', 'u8'],
    ]),
]);
class CreateMetadataV2 extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { metadata, metadataData, updateAuthority, mint, mintAuthority } = params;
        const data = CreateMetadataV2Args.serialize({
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
exports.CreateMetadataV2 = CreateMetadataV2;
//# sourceMappingURL=CreateMetadataV2.js.map