"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMasterEdition = exports.mintAndCreateMetadataV2 = exports.mintAndCreateMetadata = exports.createMetadata = exports.createMetadataV2 = void 0;
const utils_1 = require("../utils");
const amman_1 = require("@metaplex-foundation/amman");
const mpl_token_metadata_1 = require("../../src/mpl-token-metadata");
const bn_js_1 = __importDefault(require("bn.js"));
const spl = __importStar(require("@solana/spl-token"));
const spl_token_1 = require("@solana/spl-token");
function createMetadataV2({ transactionHandler, publicKey, mint, metadataData, updateAuthority, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const metadata = yield mpl_token_metadata_1.Metadata.getPDA(mint);
        const createMetadataTx = new mpl_token_metadata_1.CreateMetadataV2({ feePayer: publicKey }, {
            metadata,
            metadataData,
            updateAuthority: updateAuthority !== null && updateAuthority !== void 0 ? updateAuthority : publicKey,
            mint: mint,
            mintAuthority: publicKey,
        });
        const createTxDetails = yield transactionHandler.sendAndConfirmTransaction(createMetadataTx, [], {
            skipPreflight: false,
        });
        return { metadata, createTxDetails };
    });
}
exports.createMetadataV2 = createMetadataV2;
function createMetadata({ transactionHandler, publicKey, editionMint, metadataData, updateAuthority, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const metadata = yield mpl_token_metadata_1.Metadata.getPDA(editionMint);
        const createMetadataTx = new mpl_token_metadata_1.CreateMetadata({ feePayer: publicKey }, {
            metadata,
            metadataData,
            updateAuthority: updateAuthority !== null && updateAuthority !== void 0 ? updateAuthority : publicKey,
            mint: editionMint,
            mintAuthority: publicKey,
        });
        const createTxDetails = yield transactionHandler.sendAndConfirmTransaction(createMetadataTx, [], amman_1.defaultSendOptions);
        return { metadata, createTxDetails };
    });
}
exports.createMetadata = createMetadata;
function mintAndCreateMetadata(connection, transactionHandler, payer, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const mint = yield spl_token_1.Token.createMint(connection, payer, payer.publicKey, null, 6, spl_token_1.TOKEN_PROGRAM_ID);
        (0, utils_1.addLabel)('mint', mint.publicKey);
        const initMetadataData = new mpl_token_metadata_1.MetadataDataData(args);
        const { createTxDetails, metadata } = yield createMetadata({
            transactionHandler,
            publicKey: payer.publicKey,
            editionMint: mint.publicKey,
            metadataData: initMetadataData,
        });
        (0, utils_1.addLabel)('metadata', metadata);
        (0, utils_1.logDebug)(createTxDetails.txSummary.logMessages.join('\n'));
        return { mint, metadata };
    });
}
exports.mintAndCreateMetadata = mintAndCreateMetadata;
function mintAndCreateMetadataV2(connection, transactionHandler, payer, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const mint = yield spl.Token.createMint(connection, payer, payer.publicKey, null, 0, spl.TOKEN_PROGRAM_ID);
        const fromTokenAccount = yield mint.getOrCreateAssociatedAccountInfo(payer.publicKey);
        yield mint.mintTo(fromTokenAccount.address, payer.publicKey, [], 1);
        (0, utils_1.addLabel)('mint', mint.publicKey);
        const initMetadataData = args;
        const { createTxDetails, metadata } = yield createMetadataV2({
            transactionHandler,
            publicKey: payer.publicKey,
            mint: mint.publicKey,
            metadataData: initMetadataData,
        });
        (0, utils_1.addLabel)('metadata', metadata);
        (0, utils_1.logDebug)(createTxDetails.txSummary.logMessages.join('\n'));
        return { mint, metadata };
    });
}
exports.mintAndCreateMetadataV2 = mintAndCreateMetadataV2;
function createMasterEdition(connection, transactionHandler, payer, args, maxSupply) {
    return __awaiter(this, void 0, void 0, function* () {
        const { mint, metadata } = yield mintAndCreateMetadataV2(connection, transactionHandler, payer, args);
        const masterEditionPubkey = yield mpl_token_metadata_1.MasterEdition.getPDA(mint.publicKey);
        const createMev3 = new mpl_token_metadata_1.CreateMasterEditionV3({ feePayer: payer.publicKey }, {
            edition: masterEditionPubkey,
            metadata: metadata,
            updateAuthority: payer.publicKey,
            mint: mint.publicKey,
            mintAuthority: payer.publicKey,
            maxSupply: new bn_js_1.default(maxSupply),
        });
        const createTxDetails = yield transactionHandler.sendAndConfirmTransaction(createMev3, [], {
            skipPreflight: true,
        });
        return { mint, metadata, masterEditionPubkey, createTxDetails };
    });
}
exports.createMasterEdition = createMasterEdition;
//# sourceMappingURL=create-metadata.js.map