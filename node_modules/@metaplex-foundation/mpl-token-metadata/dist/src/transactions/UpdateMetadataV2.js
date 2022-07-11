"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMetadataV2 = exports.UpdateMetadataV2Args = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const Metadata_1 = require("../accounts/Metadata");
const MetadataProgram_1 = require("../MetadataProgram");
class UpdateMetadataV2Args extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 15;
    }
}
exports.UpdateMetadataV2Args = UpdateMetadataV2Args;
UpdateMetadataV2Args.SCHEMA = new Map([
    ...Metadata_1.DataV2.SCHEMA,
    ...UpdateMetadataV2Args.struct([
        ['instruction', 'u8'],
        ['data', { kind: 'option', type: Metadata_1.DataV2 }],
        ['updateAuthority', { kind: 'option', type: 'pubkeyAsString' }],
        ['primarySaleHappened', { kind: 'option', type: 'u8' }],
        ['isMutable', { kind: 'option', type: 'u8' }],
    ]),
]);
class UpdateMetadataV2 extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { metadata, metadataData, updateAuthority, newUpdateAuthority, primarySaleHappened, isMutable, } = params;
        const data = UpdateMetadataV2Args.serialize({
            data: metadataData,
            updateAuthority: newUpdateAuthority && newUpdateAuthority.toString(),
            primarySaleHappened: primarySaleHappened || null,
            isMutable: isMutable || null,
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
exports.UpdateMetadataV2 = UpdateMetadataV2;
//# sourceMappingURL=UpdateMetadataV2.js.map