"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignMetadata = exports.SignMetadataArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const MetadataProgram_1 = require("../MetadataProgram");
class SignMetadataArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 7;
    }
}
exports.SignMetadataArgs = SignMetadataArgs;
SignMetadataArgs.SCHEMA = SignMetadataArgs.struct([['instruction', 'u8']]);
class SignMetadata extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { metadata, creator } = params;
        const data = SignMetadataArgs.serialize();
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: metadata,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: creator,
                    isSigner: true,
                    isWritable: false,
                },
            ],
            programId: MetadataProgram_1.MetadataProgram.PUBKEY,
            data,
        }));
    }
}
exports.SignMetadata = SignMetadata;
//# sourceMappingURL=SignMetadata.js.map