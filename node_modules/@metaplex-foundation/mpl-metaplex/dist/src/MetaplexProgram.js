"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaplexProgram = exports.MetaplexKey = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
var MetaplexKey;
(function (MetaplexKey) {
    MetaplexKey[MetaplexKey["Uninitialized"] = 0] = "Uninitialized";
    MetaplexKey[MetaplexKey["OriginalAuthorityLookupV1"] = 1] = "OriginalAuthorityLookupV1";
    MetaplexKey[MetaplexKey["BidRedemptionTicketV1"] = 2] = "BidRedemptionTicketV1";
    MetaplexKey[MetaplexKey["StoreV1"] = 3] = "StoreV1";
    MetaplexKey[MetaplexKey["WhitelistedCreatorV1"] = 4] = "WhitelistedCreatorV1";
    MetaplexKey[MetaplexKey["PayoutTicketV1"] = 5] = "PayoutTicketV1";
    MetaplexKey[MetaplexKey["SafetyDepositValidationTicketV1"] = 6] = "SafetyDepositValidationTicketV1";
    MetaplexKey[MetaplexKey["AuctionManagerV1"] = 7] = "AuctionManagerV1";
    MetaplexKey[MetaplexKey["PrizeTrackingTicketV1"] = 8] = "PrizeTrackingTicketV1";
    MetaplexKey[MetaplexKey["SafetyDepositConfigV1"] = 9] = "SafetyDepositConfigV1";
    MetaplexKey[MetaplexKey["AuctionManagerV2"] = 10] = "AuctionManagerV2";
    MetaplexKey[MetaplexKey["BidRedemptionTicketV2"] = 11] = "BidRedemptionTicketV2";
    MetaplexKey[MetaplexKey["AuctionWinnerTokenTypeTrackerV1"] = 12] = "AuctionWinnerTokenTypeTrackerV1";
    MetaplexKey[MetaplexKey["StoreIndexerV1"] = 13] = "StoreIndexerV1";
    MetaplexKey[MetaplexKey["AuctionCacheV1"] = 14] = "AuctionCacheV1";
    MetaplexKey[MetaplexKey["StoreConfigV1"] = 15] = "StoreConfigV1";
})(MetaplexKey = exports.MetaplexKey || (exports.MetaplexKey = {}));
class MetaplexProgram extends mpl_core_1.Program {
}
exports.MetaplexProgram = MetaplexProgram;
MetaplexProgram.PREFIX = 'metaplex';
MetaplexProgram.CONFIG = 'config';
MetaplexProgram.TOTALS = 'totals';
MetaplexProgram.PUBKEY = new web3_js_1.PublicKey(mpl_core_1.config.programs.metaplex);
//# sourceMappingURL=MetaplexProgram.js.map