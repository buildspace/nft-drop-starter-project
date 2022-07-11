"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveCreatorVerification = exports.RemoveCreatorVerificationArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const MetadataProgram_1 = require("../MetadataProgram");
class RemoveCreatorVerificationArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 28;
    }
}
exports.RemoveCreatorVerificationArgs = RemoveCreatorVerificationArgs;
RemoveCreatorVerificationArgs.SCHEMA = RemoveCreatorVerificationArgs.struct([['instruction', 'u8']]);
class RemoveCreatorVerification extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { metadata, creator } = params;
        const data = RemoveCreatorVerificationArgs.serialize();
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
exports.RemoveCreatorVerification = RemoveCreatorVerification;
//# sourceMappingURL=RemoveCreatorVerification.js.map