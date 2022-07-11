"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePrimarySaleHappenedViaToken = exports.UpdatePrimarySaleHappenedViaTokenArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const MetadataProgram_1 = require("../MetadataProgram");
class UpdatePrimarySaleHappenedViaTokenArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 4;
    }
}
exports.UpdatePrimarySaleHappenedViaTokenArgs = UpdatePrimarySaleHappenedViaTokenArgs;
UpdatePrimarySaleHappenedViaTokenArgs.SCHEMA = UpdatePrimarySaleHappenedViaTokenArgs.struct([['instruction', 'u8']]);
class UpdatePrimarySaleHappenedViaToken extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { metadata, owner, tokenAccount } = params;
        const data = UpdatePrimarySaleHappenedViaTokenArgs.serialize();
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: metadata,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: owner,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: tokenAccount,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: MetadataProgram_1.MetadataProgram.PUBKEY,
            data,
        }));
    }
}
exports.UpdatePrimarySaleHappenedViaToken = UpdatePrimarySaleHappenedViaToken;
//# sourceMappingURL=UpdatePrimarySaleHappenedViaToken.js.map