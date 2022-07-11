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
const mpl_token_metadata_1 = require("../src/mpl-token-metadata");
const utils_1 = require("./utils");
const amman_1 = require("@metaplex-foundation/amman");
(0, utils_1.killStuckProcess)();
(0, tape_1.default)('update-metadata-account: toggle primarySaleHappened', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const { connection, transactionHandler, payer, metadata, initialMetadata } = yield (0, utils_1.initMetadata)();
    t.notOk(initialMetadata.primarySaleHappened, 'initially sale has not happened');
    const tx = new mpl_token_metadata_1.UpdateMetadata({}, {
        metadata,
        updateAuthority: payer.publicKey,
        primarySaleHappened: true,
    });
    yield transactionHandler.sendAndConfirmTransaction(tx, [payer]);
    const updatedMetadata = yield (0, utils_1.getMetadataData)(connection, metadata);
    t.ok(updatedMetadata.primarySaleHappened, 'after update sale happened');
    (0, utils_1.assertMetadataDataUnchanged)(t, initialMetadata, updatedMetadata, 'primarySaleHappened');
}));
(0, tape_1.default)('update-metadata-account: update with same data', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const { connection, transactionHandler, payer, metadata, initialMetadata } = yield (0, utils_1.initMetadata)();
    const tx = new mpl_token_metadata_1.UpdateMetadata({}, {
        metadata,
        metadataData: initialMetadata.data,
        updateAuthority: payer.publicKey,
    });
    yield transactionHandler.sendAndConfirmTransaction(tx, [payer]);
    const updatedMetadata = yield (0, utils_1.getMetadataData)(connection, metadata);
    (0, utils_1.assertMetadataDataUnchanged)(t, initialMetadata, updatedMetadata);
}));
(0, tape_1.default)('update-metadata-account: uri', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const { connection, transactionHandler, payer, metadata, initialMetadata } = yield (0, utils_1.initMetadata)();
    const tx = new mpl_token_metadata_1.UpdateMetadata({}, {
        metadata,
        metadataData: new mpl_token_metadata_1.MetadataDataData(Object.assign(Object.assign({}, initialMetadata.data), { uri: `${utils_1.URI}-updated` })),
        updateAuthority: payer.publicKey,
    });
    yield transactionHandler.sendAndConfirmTransaction(tx, [payer]);
    const updatedMetadata = yield (0, utils_1.getMetadataData)(connection, metadata);
    t.equal(updatedMetadata.data.uri, `${utils_1.URI}-updated`, 'updates uri');
    (0, utils_1.assertMetadataDataDataUnchanged)(t, initialMetadata.data, updatedMetadata.data, ['uri']);
}));
(0, tape_1.default)('update-metadata-account: name and symbol', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const { connection, transactionHandler, payer, metadata, initialMetadata } = yield (0, utils_1.initMetadata)();
    const tx = new mpl_token_metadata_1.UpdateMetadata({}, {
        metadata,
        metadataData: new mpl_token_metadata_1.MetadataDataData(Object.assign(Object.assign({}, initialMetadata.data), { name: `${utils_1.NAME}-updated`, symbol: `${utils_1.SYMBOL}++` })),
        updateAuthority: payer.publicKey,
    });
    yield transactionHandler.sendAndConfirmTransaction(tx, [payer]);
    const updatedMetadata = yield (0, utils_1.getMetadataData)(connection, metadata);
    t.equal(updatedMetadata.data.name, `${utils_1.NAME}-updated`, 'updates name');
    t.equal(updatedMetadata.data.symbol, `${utils_1.SYMBOL}++`, 'updates symbol');
    (0, utils_1.assertMetadataDataDataUnchanged)(t, initialMetadata.data, updatedMetadata.data, [
        'name',
        'symbol',
    ]);
}));
(0, tape_1.default)('update-metadata-account: update symbol too long', (t) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionHandler, payer, metadata, initialMetadata } = yield (0, utils_1.initMetadata)();
    const tx = new mpl_token_metadata_1.UpdateMetadata({}, {
        metadata,
        metadataData: new mpl_token_metadata_1.MetadataDataData(Object.assign(Object.assign({}, initialMetadata.data), { symbol: `${utils_1.SYMBOL}-too-long` })),
        updateAuthority: payer.publicKey,
    });
    try {
        yield transactionHandler.sendAndConfirmTransaction(tx, [payer]);
        t.fail('expected transaction to fail');
    }
    catch (err) {
        (0, amman_1.assertError)(t, err, [/custom program error/i, /Symbol too long/i]);
    }
}));
//# sourceMappingURL=update-metadata-account.test.js.map