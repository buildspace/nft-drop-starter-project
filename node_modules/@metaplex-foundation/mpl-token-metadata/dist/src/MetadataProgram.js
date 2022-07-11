"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataProgram = void 0;
const web3_js_1 = require("@solana/web3.js");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
class MetadataProgram extends mpl_core_1.Program {
    static findEditionAccount(mint, editionNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([
                Buffer.from(MetadataProgram.PREFIX, 'utf8'),
                MetadataProgram.PUBKEY.toBuffer(),
                mint.toBuffer(),
                Buffer.from(MetadataProgram.EDITION, 'utf8'),
                Buffer.from(editionNumber, 'utf8'),
            ], MetadataProgram.PUBKEY);
        });
    }
    static findMasterEditionAccount(mint) {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([
                Buffer.from(MetadataProgram.PREFIX, 'utf8'),
                MetadataProgram.PUBKEY.toBuffer(),
                mint.toBuffer(),
                Buffer.from(MetadataProgram.EDITION, 'utf8'),
            ], MetadataProgram.PUBKEY);
        });
    }
    static findMetadataAccount(mint) {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([
                Buffer.from(MetadataProgram.PREFIX, 'utf8'),
                MetadataProgram.PUBKEY.toBuffer(),
                mint.toBuffer(),
            ], MetadataProgram.PUBKEY);
        });
    }
    static findUseAuthorityAccount(mint, authority) {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([
                Buffer.from(MetadataProgram.PREFIX, 'utf8'),
                MetadataProgram.PUBKEY.toBuffer(),
                mint.toBuffer(),
                Buffer.from(MetadataProgram.USER, 'utf8'),
                authority.toBuffer(),
            ], MetadataProgram.PUBKEY);
        });
    }
    static findCollectionAuthorityAccount(mint, authority) {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([
                Buffer.from(MetadataProgram.PREFIX, 'utf8'),
                MetadataProgram.PUBKEY.toBuffer(),
                mint.toBuffer(),
                Buffer.from(MetadataProgram.COLLECTION_AUTHORITY, 'utf8'),
                authority.toBuffer(),
            ], MetadataProgram.PUBKEY);
        });
    }
    static findProgramAsBurnerAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([
                Buffer.from(MetadataProgram.PREFIX, 'utf8'),
                MetadataProgram.PUBKEY.toBuffer(),
                Buffer.from(MetadataProgram.BURN, 'utf8'),
            ], MetadataProgram.PUBKEY);
        });
    }
}
exports.MetadataProgram = MetadataProgram;
MetadataProgram.PREFIX = 'metadata';
MetadataProgram.EDITION = 'edition';
MetadataProgram.USER = 'user';
MetadataProgram.COLLECTION_AUTHORITY = 'collection_authority';
MetadataProgram.BURN = 'burn';
MetadataProgram.PUBKEY = new web3_js_1.PublicKey(mpl_core_1.config.programs.metadata);
//# sourceMappingURL=MetadataProgram.js.map