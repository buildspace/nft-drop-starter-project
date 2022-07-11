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
exports.MasterEdition = exports.MasterEditionV2Data = exports.MasterEditionV1Data = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const bs58_1 = __importDefault(require("bs58"));
const Edition_1 = require("./Edition");
const MetadataProgram_1 = require("../MetadataProgram");
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
class MasterEditionV1Data extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = constants_1.MetadataKey.MasterEditionV1;
    }
}
exports.MasterEditionV1Data = MasterEditionV1Data;
MasterEditionV1Data.SCHEMA = MasterEditionV1Data.struct([
    ['key', 'u8'],
    ['supply', 'u64'],
    ['maxSupply', { kind: 'option', type: 'u64' }],
    ['printingMint', 'pubkeyAsString'],
    ['oneTimePrintingAuthorizationMint', 'pubkeyAsString'],
]);
class MasterEditionV2Data extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = constants_1.MetadataKey.MasterEditionV2;
    }
}
exports.MasterEditionV2Data = MasterEditionV2Data;
MasterEditionV2Data.SCHEMA = MasterEditionV2Data.struct([
    ['key', 'u8'],
    ['supply', 'u64'],
    ['maxSupply', { kind: 'option', type: 'u64' }],
]);
class MasterEdition extends mpl_core_1.Account {
    constructor(key, info) {
        super(key, info);
        if (!this.assertOwner(MetadataProgram_1.MetadataProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (MasterEdition.isMasterEditionV1(this.info.data)) {
            this.data = MasterEditionV1Data.deserialize(this.info.data);
        }
        else if (MasterEdition.isMasterEditionV2(this.info.data)) {
            this.data = MasterEditionV2Data.deserialize(this.info.data);
        }
        else {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
    }
    static getPDA(mint) {
        return __awaiter(this, void 0, void 0, function* () {
            return MetadataProgram_1.MetadataProgram.findProgramAddress([
                buffer_1.Buffer.from(MetadataProgram_1.MetadataProgram.PREFIX),
                MetadataProgram_1.MetadataProgram.PUBKEY.toBuffer(),
                new web3_js_1.PublicKey(mint).toBuffer(),
                buffer_1.Buffer.from(MasterEdition.EDITION_PREFIX),
            ]);
        });
    }
    static isCompatible(data) {
        return MasterEdition.isMasterEditionV1(data) || MasterEdition.isMasterEditionV2(data);
    }
    static isMasterEditionV1(data) {
        return data[0] === constants_1.MetadataKey.MasterEditionV1;
    }
    static isMasterEditionV2(data) {
        return data[0] === constants_1.MetadataKey.MasterEditionV2;
    }
    getEditions(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield MetadataProgram_1.MetadataProgram.getProgramAccounts(connection, {
                filters: [
                    {
                        memcmp: {
                            offset: 0,
                            bytes: bs58_1.default.encode(buffer_1.Buffer.from([constants_1.MetadataKey.EditionV1])),
                        },
                    },
                    {
                        memcmp: {
                            offset: 1,
                            bytes: this.pubkey.toBase58(),
                        },
                    },
                ],
            })).map((account) => Edition_1.Edition.from(account));
        });
    }
}
exports.MasterEdition = MasterEdition;
MasterEdition.EDITION_PREFIX = 'edition';
//# sourceMappingURL=MasterEdition.js.map