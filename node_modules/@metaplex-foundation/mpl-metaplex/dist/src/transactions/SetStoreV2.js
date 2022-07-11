"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetStoreV2 = exports.SetStoreV2Args = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const mpl_token_vault_1 = require("@metaplex-foundation/mpl-token-vault");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const mpl_auction_1 = require("@metaplex-foundation/mpl-auction");
const MetaplexProgram_1 = require("../MetaplexProgram");
class SetStoreV2Args extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 23;
    }
}
exports.SetStoreV2Args = SetStoreV2Args;
_a = SetStoreV2Args;
SetStoreV2Args.SCHEMA = _a.struct([
    ['instruction', 'u8'],
    ['public', 'u8'],
    ['settingsUri', { kind: 'option', type: 'string' }],
]);
class SetStoreV2 extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { admin, store, config, isPublic, settingsUri } = params;
        const data = SetStoreV2Args.serialize({ public: isPublic, settingsUri });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: store,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: config,
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
                { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                {
                    pubkey: mpl_token_vault_1.VaultProgram.PUBKEY,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: mpl_token_metadata_1.MetadataProgram.PUBKEY,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: mpl_auction_1.AuctionProgram.PUBKEY,
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
exports.SetStoreV2 = SetStoreV2;
//# sourceMappingURL=SetStoreV2.js.map