"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollctionAuthorityRecord = exports.Collection = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const constants_1 = require("./constants");
class Collection extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = args.key;
        this.verified = args.verified;
    }
}
exports.Collection = Collection;
Collection.SCHEMA = Collection.struct([
    ['verified', 'u8'],
    ['key', 'pubkeyAsString'],
]);
class CollctionAuthorityRecord extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = constants_1.MetadataKey.CollectionAuthorityRecord;
        this.bump = args.bump;
    }
}
exports.CollctionAuthorityRecord = CollctionAuthorityRecord;
CollctionAuthorityRecord.SCHEMA = CollctionAuthorityRecord.struct([
    ['key', 'u8'],
    ['bump', 'u8'],
]);
//# sourceMappingURL=Collection.js.map