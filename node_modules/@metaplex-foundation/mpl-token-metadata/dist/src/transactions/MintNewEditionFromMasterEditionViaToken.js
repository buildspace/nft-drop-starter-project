"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintNewEditionFromMasterEditionViaToken = exports.MintNewEditionFromMasterEditionViaTokenArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const MetadataProgram_1 = require("../MetadataProgram");
class MintNewEditionFromMasterEditionViaTokenArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 11;
    }
}
exports.MintNewEditionFromMasterEditionViaTokenArgs = MintNewEditionFromMasterEditionViaTokenArgs;
MintNewEditionFromMasterEditionViaTokenArgs.SCHEMA = MintNewEditionFromMasterEditionViaTokenArgs.struct([
    ['instruction', 'u8'],
    ['edition', 'u64'],
]);
class MintNewEditionFromMasterEditionViaToken extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { feePayer } = options;
        const { edition, metadata, updateAuthority, masterEdition, masterMetadata, mint, editionMarker, mintAuthority, tokenOwner, tokenAccount, editionValue, } = params;
        const data = MintNewEditionFromMasterEditionViaTokenArgs.serialize({
            edition: editionValue,
        });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: metadata,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: edition,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: masterEdition,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: mint,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: editionMarker,
                    isSigner: false,
                    isWritable: true,
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
                    pubkey: tokenOwner,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: tokenAccount,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: updateAuthority,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: masterMetadata,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: spl_token_1.TOKEN_PROGRAM_ID,
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
exports.MintNewEditionFromMasterEditionViaToken = MintNewEditionFromMasterEditionViaToken;
//# sourceMappingURL=MintNewEditionFromMasterEditionViaToken.js.map