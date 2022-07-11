"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseAuthorityRecord = exports.Uses = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const _1 = require(".");
class Uses extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.useMethod = args.useMethod;
        this.total = args.total;
        this.remaining = args.remaining;
    }
}
exports.Uses = Uses;
Uses.SCHEMA = Uses.struct([
    ['useMethod', 'u8'],
    ['total', 'u64'],
    ['remaining', 'u64'],
]);
class UseAuthorityRecord extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = _1.MetadataKey.UseAuthorityRecord;
        this.allowedUses = args.allowedUses;
        this.bump = args.bump;
    }
}
exports.UseAuthorityRecord = UseAuthorityRecord;
UseAuthorityRecord.SCHEMA = UseAuthorityRecord.struct([
    ['key', 'u8'],
    ['allowedUses', 'u64'],
    ['bump', 'u8'],
]);
//# sourceMappingURL=Uses.js.map