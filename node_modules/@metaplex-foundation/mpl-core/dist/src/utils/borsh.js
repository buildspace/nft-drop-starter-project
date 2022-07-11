"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = exports.deserializeUnchecked = exports.deserialize = exports.struct = exports.Data = exports.extendBorsh = void 0;
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("borsh");
Object.defineProperty(exports, "deserializeUnchecked", { enumerable: true, get: function () { return borsh_1.deserializeUnchecked; } });
Object.defineProperty(exports, "serialize", { enumerable: true, get: function () { return borsh_1.serialize; } });
Object.defineProperty(exports, "deserialize", { enumerable: true, get: function () { return borsh_1.deserialize; } });
const bs58_1 = __importDefault(require("bs58"));
const extendBorsh = () => {
    borsh_1.BinaryReader.prototype.readPubkey = function () {
        const array = this.readFixedArray(32);
        return new web3_js_1.PublicKey(array);
    };
    borsh_1.BinaryWriter.prototype.writePubkey = function (value) {
        this.writeFixedArray(value.toBuffer());
    };
    borsh_1.BinaryReader.prototype.readPubkeyAsString = function () {
        const array = this.readFixedArray(32);
        return bs58_1.default.encode(array);
    };
    borsh_1.BinaryWriter.prototype.writePubkeyAsString = function (value) {
        this.writeFixedArray(bs58_1.default.decode(value));
    };
};
exports.extendBorsh = extendBorsh;
(0, exports.extendBorsh)();
class Data {
    constructor(args = {}) {
        Object.assign(this, args);
    }
    static struct(fields) {
        return (0, exports.struct)(this, fields);
    }
    static serialize(args = {}) {
        return Buffer.from((0, borsh_1.serialize)(this.SCHEMA, new this(args)));
    }
    static deserialize(data) {
        return (0, borsh_1.deserializeUnchecked)(this.SCHEMA, this, data);
    }
}
exports.Data = Data;
const struct = (type, fields) => {
    return new Map([[type, { kind: 'struct', fields }]]);
};
exports.struct = struct;
//# sourceMappingURL=borsh.js.map