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
exports.assertMetadataDataDataUnchanged = exports.assertMetadataDataUnchanged = exports.getMetadataData = exports.initMetadata = exports.SELLER_FEE_BASIS_POINTS = exports.SYMBOL = exports.NAME = exports.URI = void 0;
const spok_1 = __importDefault(require("spok"));
const web3_js_1 = require("@solana/web3.js");
const mpl_token_metadata_1 = require("../../src/mpl-token-metadata");
const _1 = require("./");
const amman_1 = require("@metaplex-foundation/amman");
const address_labels_1 = require("./address-labels");
const actions_1 = require("../actions");
exports.URI = 'uri';
exports.NAME = 'test';
exports.SYMBOL = 'sym';
exports.SELLER_FEE_BASIS_POINTS = 10;
function initMetadata() {
    return __awaiter(this, void 0, void 0, function* () {
        const payer = web3_js_1.Keypair.generate();
        (0, address_labels_1.addLabel)('payer', payer);
        const connection = new web3_js_1.Connection(_1.connectionURL, 'singleGossip');
        const transactionHandler = new amman_1.PayerTransactionHandler(connection, payer);
        yield (0, amman_1.airdrop)(connection, payer.publicKey, 2);
        const initMetadataData = new mpl_token_metadata_1.MetadataDataData({
            uri: exports.URI,
            name: exports.NAME,
            symbol: exports.SYMBOL,
            sellerFeeBasisPoints: exports.SELLER_FEE_BASIS_POINTS,
            creators: null,
        });
        const { mint, metadata } = yield (0, actions_1.mintAndCreateMetadata)(connection, transactionHandler, payer, initMetadataData);
        const initialMetadata = yield getMetadataData(connection, metadata);
        return { connection, transactionHandler, payer, mint, metadata, initialMetadata };
    });
}
exports.initMetadata = initMetadata;
function getMetadataData(connection, metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const metadataAccount = yield connection.getAccountInfo(metadata);
        return mpl_token_metadata_1.MetadataData.deserialize(metadataAccount.data);
    });
}
exports.getMetadataData = getMetadataData;
function assertMetadataDataUnchanged(t, initial, updated, except) {
    return __awaiter(this, void 0, void 0, function* () {
        const x = Object.assign({}, initial);
        if (except != null) {
            delete x[except];
        }
        delete x.data.creators;
        delete x.tokenStandard;
        delete x.collection;
        delete x.uses;
        const y = Object.assign({ $topic: `no change except '${except}' on metadata` }, updated);
        if (except != null) {
            delete y[except];
        }
        delete y.data.creators;
        delete y.tokenStandard;
        delete y.collection;
        delete y.uses;
        (0, spok_1.default)(t, x, y);
    });
}
exports.assertMetadataDataUnchanged = assertMetadataDataUnchanged;
function assertMetadataDataDataUnchanged(t, initial, updated, except) {
    return __awaiter(this, void 0, void 0, function* () {
        const x = Object.assign({}, initial);
        except.forEach((f) => delete x[f]);
        delete x.creators;
        const y = Object.assign({ $topic: `no change except '${except}' on metadataData` }, updated);
        except.forEach((f) => delete y[f]);
        delete y.creators;
        (0, spok_1.default)(t, x, y);
    });
}
exports.assertMetadataDataDataUnchanged = assertMetadataDataDataUnchanged;
//# sourceMappingURL=metadata.js.map