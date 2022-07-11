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
exports.Auction = exports.AuctionData = exports.PriceFloor = exports.BidState = exports.Bid = exports.PriceFloorType = exports.BidStateType = exports.AuctionState = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer");
const AuctionProgram_1 = require("../AuctionProgram");
const BidderMetadata_1 = require("./BidderMetadata");
const BidderPot_1 = require("./BidderPot");
var AuctionState;
(function (AuctionState) {
    AuctionState[AuctionState["Created"] = 0] = "Created";
    AuctionState[AuctionState["Started"] = 1] = "Started";
    AuctionState[AuctionState["Ended"] = 2] = "Ended";
})(AuctionState = exports.AuctionState || (exports.AuctionState = {}));
var BidStateType;
(function (BidStateType) {
    BidStateType[BidStateType["EnglishAuction"] = 0] = "EnglishAuction";
    BidStateType[BidStateType["OpenEdition"] = 1] = "OpenEdition";
})(BidStateType = exports.BidStateType || (exports.BidStateType = {}));
var PriceFloorType;
(function (PriceFloorType) {
    PriceFloorType[PriceFloorType["None"] = 0] = "None";
    PriceFloorType[PriceFloorType["Minimum"] = 1] = "Minimum";
    PriceFloorType[PriceFloorType["BlindedPrice"] = 2] = "BlindedPrice";
})(PriceFloorType = exports.PriceFloorType || (exports.PriceFloorType = {}));
class Bid extends mpl_core_1.Borsh.Data {
}
exports.Bid = Bid;
Bid.SCHEMA = Bid.struct([
    ['key', 'pubkeyAsString'],
    ['amount', 'u64'],
]);
class BidState extends mpl_core_1.Borsh.Data {
    getWinnerAt(winnerIndex) {
        const convertedIndex = this.bids.length - winnerIndex - 1;
        if (convertedIndex >= 0 && convertedIndex < this.bids.length) {
            return this.bids[convertedIndex].key;
        }
        else {
            return null;
        }
    }
    getAmountAt(winnerIndex) {
        const convertedIndex = this.bids.length - winnerIndex - 1;
        if (convertedIndex >= 0 && convertedIndex < this.bids.length) {
            return this.bids[convertedIndex].amount;
        }
        else {
            return null;
        }
    }
    getWinnerIndex(bidder) {
        if (!this.bids) {
            return null;
        }
        const index = this.bids.findIndex((b) => b.key === bidder);
        if (index !== -1) {
            const zeroBased = this.bids.length - index - 1;
            return zeroBased < this.max.toNumber() ? zeroBased : null;
        }
        return null;
    }
}
exports.BidState = BidState;
BidState.SCHEMA = new Map([
    ...Bid.SCHEMA,
    ...BidState.struct([
        ['type', 'u8'],
        ['bids', [Bid]],
        ['max', 'u64'],
    ]),
]);
class PriceFloor extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super();
        this.type = args.type;
        this.hash = args.hash || new Uint8Array(32);
        if (this.type === PriceFloorType.Minimum) {
            if (args.minPrice) {
                this.hash.set(args.minPrice.toArrayLike(buffer_1.Buffer, 'le', 8), 0);
            }
            else {
                this.minPrice = new bn_js_1.default((args.hash || new Uint8Array(0)).slice(0, 8), 'le');
            }
        }
    }
}
exports.PriceFloor = PriceFloor;
PriceFloor.SCHEMA = PriceFloor.struct([
    ['type', 'u8'],
    ['hash', [32]],
]);
class AuctionData extends mpl_core_1.Borsh.Data {
}
exports.AuctionData = AuctionData;
AuctionData.SCHEMA = new Map([
    ...BidState.SCHEMA,
    ...PriceFloor.SCHEMA,
    ...AuctionData.struct([
        ['authority', 'pubkeyAsString'],
        ['tokenMint', 'pubkeyAsString'],
        ['lastBid', { kind: 'option', type: 'u64' }],
        ['endedAt', { kind: 'option', type: 'u64' }],
        ['endAuctionAt', { kind: 'option', type: 'u64' }],
        ['auctionGap', { kind: 'option', type: 'u64' }],
        ['priceFloor', PriceFloor],
        ['state', 'u8'],
        ['bidState', BidState],
    ]),
]);
class Auction extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        if (!this.assertOwner(AuctionProgram_1.AuctionProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        this.data = AuctionData.deserialize(this.info.data);
    }
    static getPDA(vault) {
        return AuctionProgram_1.AuctionProgram.findProgramAddress([
            buffer_1.Buffer.from(AuctionProgram_1.AuctionProgram.PREFIX),
            AuctionProgram_1.AuctionProgram.PUBKEY.toBuffer(),
            new web3_js_1.PublicKey(vault).toBuffer(),
        ]);
    }
    static findMany(connection, filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield AuctionProgram_1.AuctionProgram.getProgramAccounts(connection, {
                filters: [
                    filters.authority && {
                        memcmp: {
                            offset: 0,
                            bytes: new web3_js_1.PublicKey(filters.authority).toBase58(),
                        },
                    },
                ].filter(Boolean),
            }))
                .map((account) => {
                try {
                    return Auction.from(account);
                }
                catch (err) { }
            })
                .filter(Boolean);
        });
    }
    getBidderPots(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield AuctionProgram_1.AuctionProgram.getProgramAccounts(connection, {
                filters: [
                    {
                        dataSize: BidderPot_1.BidderPot.DATA_SIZE,
                    },
                    {
                        memcmp: {
                            offset: 32 + 32,
                            bytes: this.pubkey.toBase58(),
                        },
                    },
                ],
            })).map((account) => BidderPot_1.BidderPot.from(account));
        });
    }
    getBidderMetadata(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield AuctionProgram_1.AuctionProgram.getProgramAccounts(connection, {
                filters: [
                    {
                        dataSize: BidderMetadata_1.BidderMetadata.DATA_SIZE,
                    },
                    {
                        memcmp: {
                            offset: 32,
                            bytes: this.pubkey.toBase58(),
                        },
                    },
                ],
            })).map((account) => BidderMetadata_1.BidderMetadata.from(account));
        });
    }
}
exports.Auction = Auction;
Auction.EXTENDED_DATA_SIZE = 8 + 9 + 2 + 200;
//# sourceMappingURL=Auction.js.map