"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMetadata = exports.UpdateMetadataArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const Metadata_1 = require("../accounts/Metadata");
const MetadataProgram_1 = require("../MetadataProgram");
class UpdateMetadataArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 1;
    }
}
exports.UpdateMetadataArgs = UpdateMetadataArgs;
UpdateMetadataArgs.SCHEMA = new Map([
    ...Metadata_1.MetadataDataData.SCHEMA,
    ...UpdateMetadataArgs.struct([
        ['instruction', 'u8'],
        ['data', { kind: 'option', type: Metadata_1.MetadataDataData }],
        ['updateAuthority', { kind: 'option', type: 'pubkeyAsString' }],
        ['primarySaleHappened', { kind: 'option', type: 'u8' }],
    ]),
]);
class UpdateMetadata extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { metadata, metadataData, updateAuthority, newUpdateAuthority, primarySaleHappened } = params;
        const data = UpdateMetadataArgs.serialize({
            data: metadataData,
            updateAuthority: newUpdateAuthority && newUpdateAuthority.toString(),
            primarySaleHappened: primarySaleHappened || null,
        });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: metadata,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: updateAuthority,
                    isSigner: true,
                    isWritable: false,
                },
            ],
            programId: MetadataProgram_1.MetadataProgram.PUBKEY,
            data,
        }));
    }
}
exports.UpdateMetadata = UpdateMetadata;
//# sourceMappingURL=UpdateMetadata.js.map