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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tape_1 = __importDefault(require("tape"));
const spok_1 = __importDefault(require("spok"));
const web3_js_1 = require("@solana/web3.js");
const mpl_token_metadata_1 = require("../src/mpl-token-metadata");
const utils_1 = require("./utils");
const amman_1 = require("@metaplex-foundation/amman");
const spl_token_1 = require("@solana/spl-token");
const utils_2 = require("./utils");
const address_labels_1 = require("./utils/address-labels");
const actions_1 = require("./actions");
(0, utils_1.killStuckProcess)();
const URI = 'uri';
const NAME = 'test';
const SYMBOL = 'sym';
const SELLER_FEE_BASIS_POINTS = 10;
(0, tape_1.default)('create-metadata-account: success', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const payer = web3_js_1.Keypair.generate();
    (0, address_labels_1.addLabel)('create:payer', payer);
    const connection = new web3_js_1.Connection(utils_1.connectionURL, 'confirmed');
    const transactionHandler = new amman_1.PayerTransactionHandler(connection, payer);
    yield (0, amman_1.airdrop)(connection, payer.publicKey, 2);
    const mint = yield spl_token_1.Token.createMint(connection, payer, payer.publicKey, null, 6, spl_token_1.TOKEN_PROGRAM_ID);
    (0, address_labels_1.addLabel)('create:mint', mint.publicKey);
    const initMetadataData = new mpl_token_metadata_1.MetadataDataData({
        uri: URI,
        name: NAME,
        symbol: SYMBOL,
        sellerFeeBasisPoints: SELLER_FEE_BASIS_POINTS,
        creators: null,
    });
    const { createTxDetails, metadata } = yield (0, actions_1.createMetadata)({
        transactionHandler,
        publicKey: payer.publicKey,
        editionMint: mint.publicKey,
        metadataData: initMetadataData,
    });
    (0, address_labels_1.addLabel)('create:metadata', metadata);
    (0, utils_2.logDebug)(createTxDetails.txSummary.logMessages.join('\n'));
    (0, amman_1.assertTransactionSummary)(t, createTxDetails.txSummary, {
        fee: 5000,
        msgRx: [/Program.+metaq/i, /Instruction.+ Create Metadata Accounts/i],
    });
    const metadataAccount = yield connection.getAccountInfo(metadata);
    (0, utils_2.logDebug)({
        metadataAccountOwner: metadataAccount.owner.toBase58(),
        metadataAccountDataBytes: metadataAccount.data.byteLength,
    });
    const metadataData = mpl_token_metadata_1.MetadataData.deserialize(metadataAccount.data);
    (0, spok_1.default)(t, metadataData, {
        $topic: 'metadataData',
        key: mpl_token_metadata_1.MetadataKey.MetadataV1,
        updateAuthority: (0, address_labels_1.isKeyOf)(payer),
        mint: (0, address_labels_1.isKeyOf)(mint.publicKey),
        data: {
            name: NAME,
            symbol: SYMBOL,
            uri: URI,
            sellerFeeBasisPoints: SELLER_FEE_BASIS_POINTS,
        },
        primarySaleHappened: 0,
        isMutable: 1,
    });
    const mintAccount = yield connection.getAccountInfo(mint.publicKey);
    (0, utils_2.logDebug)({
        mintAccountOwner: mintAccount.owner.toBase58(),
        mintAccountDataBytes: mintAccount.data.byteLength,
    });
    t.ok(mpl_token_metadata_1.Edition.isCompatible(mintAccount.data), 'mint account data is mint edition');
    const editionData = mpl_token_metadata_1.EditionData.deserialize(mintAccount.data);
    const edition = editionData.edition;
    t.ok(edition.toNumber() > 0, 'greater zero edition number');
}));
(0, tape_1.default)('create-metadata-account-v2: success', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const payer = web3_js_1.Keypair.generate();
    (0, address_labels_1.addLabel)('create:payer', payer);
    const connection = new web3_js_1.Connection(utils_1.connectionURL, 'confirmed');
    const transactionHandler = new amman_1.PayerTransactionHandler(connection, payer);
    yield (0, amman_1.airdrop)(connection, payer.publicKey, 2);
    const mint = yield spl_token_1.Token.createMint(connection, payer, payer.publicKey, null, 6, spl_token_1.TOKEN_PROGRAM_ID);
    (0, address_labels_1.addLabel)('create:mint', mint.publicKey);
    const initMetadataData = new mpl_token_metadata_1.DataV2({
        uri: URI,
        name: NAME,
        symbol: SYMBOL,
        sellerFeeBasisPoints: SELLER_FEE_BASIS_POINTS,
        creators: null,
        collection: null,
        uses: null,
    });
    const { createTxDetails, metadata } = yield (0, actions_1.createMetadataV2)({
        transactionHandler,
        publicKey: payer.publicKey,
        mint: mint.publicKey,
        metadataData: initMetadataData,
        updateAuthority: payer.publicKey,
    });
    (0, address_labels_1.addLabel)('create:metadata', metadata);
    (0, utils_2.logDebug)(createTxDetails.txSummary.logMessages.join('\n'));
    (0, amman_1.assertTransactionSummary)(t, createTxDetails.txSummary, {
        fee: 5000,
        msgRx: [/Program.+metaq/i, /Instruction.+ Create Metadata Accounts/i],
    });
    const metadataAccount = yield connection.getAccountInfo(metadata);
    (0, utils_2.logDebug)({
        metadataAccountOwner: metadataAccount.owner.toBase58(),
        metadataAccountDataBytes: metadataAccount.data.byteLength,
    });
    const metadataData = mpl_token_metadata_1.MetadataData.deserialize(metadataAccount.data);
    (0, spok_1.default)(t, metadataData, {
        $topic: 'metadataData',
        key: mpl_token_metadata_1.MetadataKey.MetadataV1,
        updateAuthority: (0, address_labels_1.isKeyOf)(payer),
        mint: (0, address_labels_1.isKeyOf)(mint.publicKey),
        data: {
            name: NAME,
            symbol: SYMBOL,
            uri: URI,
            sellerFeeBasisPoints: SELLER_FEE_BASIS_POINTS,
        },
        primarySaleHappened: 0,
        isMutable: 1,
        tokenStandard: mpl_token_metadata_1.TokenStandard.FungibleAsset,
    });
}));
//# sourceMappingURL=create-metadata-account.test.js.map