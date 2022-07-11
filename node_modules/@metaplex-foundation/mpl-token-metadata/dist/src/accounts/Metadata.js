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
exports.computeCreatorOffset = exports.MAX_CREATOR_LEN = exports.MAX_URI_LENGTH = exports.MAX_SYMBOL_LENGTH = exports.MAX_NAME_LENGTH = exports.Metadata = exports.MetadataData = exports.MetadataDataData = exports.DataV2 = exports.Creator = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const bs58_1 = __importDefault(require("bs58"));
const buffer_1 = require("buffer");
const MetadataProgram_1 = require("../MetadataProgram");
const Edition_1 = require("./Edition");
const MasterEdition_1 = require("./MasterEdition");
const Uses_1 = require("./Uses");
const Collection_1 = require("./Collection");
const constants_1 = require("./constants");
class Creator extends mpl_core_1.Borsh.Data {
}
exports.Creator = Creator;
Creator.SCHEMA = Creator.struct([
    ['address', 'pubkeyAsString'],
    ['verified', 'u8'],
    ['share', 'u8'],
]);
class DataV2 extends mpl_core_1.Borsh.Data {
}
exports.DataV2 = DataV2;
DataV2.SCHEMA = new Map([
    ...Creator.SCHEMA,
    ...Collection_1.Collection.SCHEMA,
    ...Uses_1.Uses.SCHEMA,
    ...DataV2.struct([
        ['name', 'string'],
        ['symbol', 'string'],
        ['uri', 'string'],
        ['sellerFeeBasisPoints', 'u16'],
        ['creators', { kind: 'option', type: [Creator] }],
        ['collection', { kind: 'option', type: Collection_1.Collection }],
        ['uses', { kind: 'option', type: Uses_1.Uses }],
    ]),
]);
class MetadataDataData extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        const METADATA_REPLACE = new RegExp('\u0000', 'g');
        this.name = args.name.replace(METADATA_REPLACE, '');
        this.uri = args.uri.replace(METADATA_REPLACE, '');
        this.symbol = args.symbol.replace(METADATA_REPLACE, '');
    }
}
exports.MetadataDataData = MetadataDataData;
MetadataDataData.SCHEMA = new Map([
    ...Creator.SCHEMA,
    ...MetadataDataData.struct([
        ['name', 'string'],
        ['symbol', 'string'],
        ['uri', 'string'],
        ['sellerFeeBasisPoints', 'u16'],
        ['creators', { kind: 'option', type: [Creator] }],
    ]),
]);
class MetadataData extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = constants_1.MetadataKey.MetadataV1;
    }
}
exports.MetadataData = MetadataData;
MetadataData.SCHEMA = new Map([
    ...MetadataDataData.SCHEMA,
    ...Collection_1.Collection.SCHEMA,
    ...Uses_1.Uses.SCHEMA,
    ...MetadataData.struct([
        ['key', 'u8'],
        ['updateAuthority', 'pubkeyAsString'],
        ['mint', 'pubkeyAsString'],
        ['data', MetadataDataData],
        ['primarySaleHappened', 'u8'],
        ['isMutable', 'u8'],
        ['editionNonce', { kind: 'option', type: 'u8' }],
        ['tokenStandard', { kind: 'option', type: 'u8' }],
        ['collection', { kind: 'option', type: Collection_1.Collection }],
        ['uses', { kind: 'option', type: Uses_1.Uses }],
    ]),
]);
class Metadata extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        if (!this.assertOwner(MetadataProgram_1.MetadataProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (!Metadata.isCompatible(this.info.data)) {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
        this.data = MetadataData.deserialize(this.info.data);
    }
    static isCompatible(data) {
        return data[0] === constants_1.MetadataKey.MetadataV1;
    }
    static getPDA(mint) {
        return __awaiter(this, void 0, void 0, function* () {
            return MetadataProgram_1.MetadataProgram.findProgramAddress([
                buffer_1.Buffer.from(MetadataProgram_1.MetadataProgram.PREFIX),
                MetadataProgram_1.MetadataProgram.PUBKEY.toBuffer(),
                new web3_js_1.PublicKey(mint).toBuffer(),
            ]);
        });
    }
    static findMany(connection, filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseFilters = [
                {
                    memcmp: {
                        offset: 0,
                        bytes: bs58_1.default.encode(buffer_1.Buffer.from([constants_1.MetadataKey.MetadataV1])),
                    },
                },
                filters.updateAuthority && {
                    memcmp: {
                        offset: 1,
                        bytes: new web3_js_1.PublicKey(filters.updateAuthority).toBase58(),
                    },
                },
                filters.mint && {
                    memcmp: {
                        offset: 33,
                        bytes: new web3_js_1.PublicKey(filters.mint).toBase58(),
                    },
                },
            ].filter(Boolean);
            if (filters.creators) {
                return (yield Promise.all(Array.from(Array(mpl_core_1.config.maxCreatorLimit).keys()).reduce((prev, i) => [
                    ...prev,
                    ...filters.creators.map((pubkey) => MetadataProgram_1.MetadataProgram.getProgramAccounts(connection, {
                        filters: [
                            ...baseFilters,
                            {
                                memcmp: {
                                    offset: (0, exports.computeCreatorOffset)(i),
                                    bytes: new web3_js_1.PublicKey(pubkey).toBase58(),
                                },
                            },
                        ],
                    })),
                ], [])))
                    .flat()
                    .map((account) => Metadata.from(account));
            }
            else {
                return (yield MetadataProgram_1.MetadataProgram.getProgramAccounts(connection, { filters: baseFilters })).map((account) => Metadata.from(account));
            }
        });
    }
    static findByMint(connection, mint) {
        return __awaiter(this, void 0, void 0, function* () {
            const pda = yield Metadata.getPDA(mint);
            return Metadata.load(connection, pda);
        });
    }
    static findByOwner(connection, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield mpl_core_1.TokenAccount.getTokenAccountsByOwner(connection, owner);
            const accountMap = new Map(accounts.map(({ data }) => [data.mint.toString(), data]));
            const allMetadata = yield Metadata.findMany(connection);
            return allMetadata.filter((metadata) => {
                var _a, _b;
                return accountMap.has(metadata.data.mint) &&
                    (((_b = (_a = accountMap === null || accountMap === void 0 ? void 0 : accountMap.get(metadata.data.mint)) === null || _a === void 0 ? void 0 : _a.amount) === null || _b === void 0 ? void 0 : _b.toNumber()) || 0) > 0;
            });
        });
    }
    static findByOwnerV2(connection, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield mpl_core_1.TokenAccount.getTokenAccountsByOwner(connection, owner);
            const accountsWithAmount = accounts
                .map(({ data }) => data)
                .filter(({ amount }) => (amount === null || amount === void 0 ? void 0 : amount.toNumber()) > 0);
            return (yield Promise.all(accountsWithAmount.map(({ mint }) => Metadata.findMany(connection, { mint })))).flat();
        });
    }
    static findByOwnerV3(connection, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenInfo = yield Metadata.findInfoByOwner(connection, owner);
            return Array.from(tokenInfo.entries()).map(([pubkey, info]) => new Metadata(pubkey, info));
        });
    }
    static findInfoByOwner(connection, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield mpl_core_1.TokenAccount.getTokenAccountsByOwner(connection, owner);
            const metadataPdaLookups = accounts.reduce((memo, { data }) => {
                var _a;
                return ((_a = data.amount) === null || _a === void 0 ? void 0 : _a.eq(new bn_js_1.default(1))) ? [...memo, Metadata.getPDA(data.mint)] : memo;
            }, []);
            const metadataAddresses = yield Promise.all(metadataPdaLookups);
            return mpl_core_1.Account.getInfos(connection, metadataAddresses);
        });
    }
    static findDataByOwner(connection, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenInfo = yield Metadata.findInfoByOwner(connection, owner);
            return Array.from(tokenInfo.values()).map((m) => MetadataData.deserialize(m.data));
        });
    }
    static getEdition(connection, mint) {
        return __awaiter(this, void 0, void 0, function* () {
            const pda = yield Edition_1.Edition.getPDA(mint);
            const info = yield mpl_core_1.Account.getInfo(connection, pda);
            const key = info === null || info === void 0 ? void 0 : info.data[0];
            switch (key) {
                case constants_1.MetadataKey.EditionV1:
                    return new Edition_1.Edition(pda, info);
                case constants_1.MetadataKey.MasterEditionV1:
                case constants_1.MetadataKey.MasterEditionV2:
                    return new MasterEdition_1.MasterEdition(pda, info);
                default:
                    return;
            }
        });
    }
}
exports.Metadata = Metadata;
exports.MAX_NAME_LENGTH = 32;
exports.MAX_SYMBOL_LENGTH = 10;
exports.MAX_URI_LENGTH = 200;
exports.MAX_CREATOR_LEN = 32 + 1 + 1;
const computeCreatorOffset = (index) => {
    return (1 +
        32 +
        32 +
        4 +
        exports.MAX_NAME_LENGTH +
        4 +
        exports.MAX_URI_LENGTH +
        4 +
        exports.MAX_SYMBOL_LENGTH +
        2 +
        1 +
        4 +
        index * exports.MAX_CREATOR_LEN);
};
exports.computeCreatorOffset = computeCreatorOffset;
//# sourceMappingURL=Metadata.js.map