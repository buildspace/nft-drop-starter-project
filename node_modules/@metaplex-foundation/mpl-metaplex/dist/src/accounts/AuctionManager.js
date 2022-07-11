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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionManager = exports.AuctionManagerV2Data = exports.AuctionManagerStateV2 = exports.AuctionManagerStatus = void 0;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const bs58_1 = __importDefault(require("bs58"));
const BidRedemptionTicket_1 = require("./BidRedemptionTicket");
const MetaplexProgram_1 = require("../MetaplexProgram");
const buffer_1 = require("buffer");
const mpl_auction_1 = require("@metaplex-foundation/mpl-auction");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
var AuctionManagerStatus;
(function (AuctionManagerStatus) {
    AuctionManagerStatus[AuctionManagerStatus["Initialized"] = 0] = "Initialized";
    AuctionManagerStatus[AuctionManagerStatus["Validated"] = 1] = "Validated";
    AuctionManagerStatus[AuctionManagerStatus["Running"] = 2] = "Running";
    AuctionManagerStatus[AuctionManagerStatus["Disbursing"] = 3] = "Disbursing";
    AuctionManagerStatus[AuctionManagerStatus["Finished"] = 4] = "Finished";
})(AuctionManagerStatus = exports.AuctionManagerStatus || (exports.AuctionManagerStatus = {}));
class AuctionManagerStateV2 extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.status = AuctionManagerStatus.Initialized;
        this.safetyConfigItemsValidated = new bn_js_1.default(0);
        this.bidsPushedToAcceptPayment = new bn_js_1.default(0);
        this.hasParticipation = false;
    }
}
exports.AuctionManagerStateV2 = AuctionManagerStateV2;
_a = AuctionManagerStateV2;
AuctionManagerStateV2.SCHEMA = _a.struct([
    ['status', 'u8'],
    ['safetyConfigItemsValidated', 'u64'],
    ['bidsPushedToAcceptPayment', 'u64'],
    ['hasParticipation', 'u8'],
]);
class AuctionManagerV2Data extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = MetaplexProgram_1.MetaplexKey.AuctionManagerV2;
    }
}
exports.AuctionManagerV2Data = AuctionManagerV2Data;
_b = AuctionManagerV2Data;
AuctionManagerV2Data.SCHEMA = new Map([
    ...AuctionManagerStateV2.SCHEMA,
    ..._b.struct([
        ['key', 'u8'],
        ['store', 'pubkeyAsString'],
        ['authority', 'pubkeyAsString'],
        ['auction', 'pubkeyAsString'],
        ['vault', 'pubkeyAsString'],
        ['acceptPayment', 'pubkeyAsString'],
        ['state', AuctionManagerStateV2],
    ]),
]);
class AuctionManager extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        if (!this.assertOwner(MetaplexProgram_1.MetaplexProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (AuctionManager.isAuctionManagerV1(this.info.data)) {
            throw (0, mpl_core_1.ERROR_DEPRECATED_ACCOUNT_DATA)();
        }
        else if (AuctionManager.isAuctionManagerV2(this.info.data)) {
            this.data = AuctionManagerV2Data.deserialize(this.info.data);
        }
        else {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
    }
    static isCompatible(data) {
        return AuctionManager.isAuctionManagerV1(data) || AuctionManager.isAuctionManagerV2(data);
    }
    static isAuctionManagerV1(data) {
        return data[0] === MetaplexProgram_1.MetaplexKey.AuctionManagerV1;
    }
    static isAuctionManagerV2(data) {
        return data[0] === MetaplexProgram_1.MetaplexKey.AuctionManagerV2;
    }
    static getPDA(auction) {
        return MetaplexProgram_1.MetaplexProgram.findProgramAddress([
            buffer_1.Buffer.from(MetaplexProgram_1.MetaplexProgram.PREFIX),
            new web3_js_1.PublicKey(auction).toBuffer(),
        ]);
    }
    static findMany(connection, filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield MetaplexProgram_1.MetaplexProgram.getProgramAccounts(connection, {
                filters: [
                    {
                        memcmp: {
                            offset: 0,
                            bytes: bs58_1.default.encode(buffer_1.Buffer.from([MetaplexProgram_1.MetaplexKey.AuctionManagerV2])),
                        },
                    },
                    filters.store && {
                        memcmp: {
                            offset: 1,
                            bytes: new web3_js_1.PublicKey(filters.store).toBase58(),
                        },
                    },
                    filters.authority && {
                        memcmp: {
                            offset: 33,
                            bytes: new web3_js_1.PublicKey(filters.authority).toBase58(),
                        },
                    },
                ].filter(Boolean),
            })).map((account) => AuctionManager.from(account));
        });
    }
    getAuction(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return mpl_auction_1.Auction.load(connection, this.data.auction);
        });
    }
    getBidRedemptionTickets(connection, haveWinnerIndex = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield MetaplexProgram_1.MetaplexProgram.getProgramAccounts(connection, {
                filters: [
                    {
                        memcmp: {
                            offset: 0,
                            bytes: bs58_1.default.encode(buffer_1.Buffer.from([MetaplexProgram_1.MetaplexKey.BidRedemptionTicketV2])),
                        },
                    },
                    {
                        memcmp: {
                            offset: BidRedemptionTicket_1.WINNER_INDEX_OFFSETS[+haveWinnerIndex],
                            bytes: this.pubkey.toBase58(),
                        },
                    },
                ],
            })).map((account) => BidRedemptionTicket_1.BidRedemptionTicket.from(account));
        });
    }
}
exports.AuctionManager = AuctionManager;
//# sourceMappingURL=AuctionManager.js.map