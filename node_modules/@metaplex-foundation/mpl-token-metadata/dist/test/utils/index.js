"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
exports.createCollection = exports.killStuckProcess = exports.dump = exports.connectionURL = exports.DEVNET = exports.programIds = exports.logTrace = exports.logDebug = exports.logInfo = exports.logError = void 0;
const web3_js_1 = require("@solana/web3.js");
const util_1 = require("util");
const debug_1 = __importDefault(require("debug"));
const tape_1 = __importDefault(require("tape"));
const amman_1 = require("@metaplex-foundation/amman");
const accounts_1 = require("../../src/accounts");
const metadata_1 = require("./metadata");
const actions_1 = require("../actions");
__exportStar(require("./address-labels"), exports);
__exportStar(require("./metadata"), exports);
exports.logError = (0, debug_1.default)('mpl:tm-test:error');
exports.logInfo = (0, debug_1.default)('mpl:tm-test:info');
exports.logDebug = (0, debug_1.default)('mpl:tm-test:debug');
exports.logTrace = (0, debug_1.default)('mpl:tm-test:trace');
exports.programIds = {
    metadata: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
    vault: 'vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn',
    auction: 'auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8',
    metaplex: 'p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98',
};
exports.DEVNET = (0, web3_js_1.clusterApiUrl)('devnet');
exports.connectionURL = process.env.USE_DEVNET != null ? exports.DEVNET : amman_1.LOCALHOST;
function dump(x) {
    console.log((0, util_1.inspect)(x, { depth: 5 }));
}
exports.dump = dump;
function killStuckProcess() {
    tape_1.default.onFinish(() => process.exit(0));
}
exports.killStuckProcess = killStuckProcess;
function createCollection(connection, transactionHandler, payer) {
    return __awaiter(this, void 0, void 0, function* () {
        const initMetadataData = new accounts_1.DataV2({
            uri: metadata_1.URI,
            name: metadata_1.NAME,
            symbol: metadata_1.SYMBOL,
            sellerFeeBasisPoints: metadata_1.SELLER_FEE_BASIS_POINTS,
            creators: null,
            collection: null,
            uses: null,
        });
        return yield (0, actions_1.createMasterEdition)(connection, transactionHandler, payer, initMetadataData, 0);
    });
}
exports.createCollection = createCollection;
//# sourceMappingURL=index.js.map