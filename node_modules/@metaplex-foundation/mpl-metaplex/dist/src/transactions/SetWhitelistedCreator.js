"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetWhitelistedCreator = exports.SetWhitelistedCreatorArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const MetaplexProgram_1 = require("../MetaplexProgram");
class SetWhitelistedCreatorArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 9;
    }
}
exports.SetWhitelistedCreatorArgs = SetWhitelistedCreatorArgs;
_a = SetWhitelistedCreatorArgs;
SetWhitelistedCreatorArgs.SCHEMA = _a.struct([
    ['instruction', 'u8'],
    ['activated', 'u8'],
]);
class SetWhitelistedCreator extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { admin, whitelistedCreatorPDA, store, creator, activated } = params;
        const data = SetWhitelistedCreatorArgs.serialize({ activated });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: whitelistedCreatorPDA,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: admin,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: feePayer,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: creator,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: store,
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
            programId: MetaplexProgram_1.MetaplexProgram.PUBKEY,
            data,
        }));
    }
}
exports.SetWhitelistedCreator = SetWhitelistedCreator;
//# sourceMappingURL=SetWhitelistedCreator.js.map