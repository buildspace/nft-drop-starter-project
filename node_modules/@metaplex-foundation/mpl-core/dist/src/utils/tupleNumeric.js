"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBNFromData = exports.TupleNumericType = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
var TupleNumericType;
(function (TupleNumericType) {
    TupleNumericType[TupleNumericType["U8"] = 1] = "U8";
    TupleNumericType[TupleNumericType["U16"] = 2] = "U16";
    TupleNumericType[TupleNumericType["U32"] = 4] = "U32";
    TupleNumericType[TupleNumericType["U64"] = 8] = "U64";
})(TupleNumericType = exports.TupleNumericType || (exports.TupleNumericType = {}));
const getBNFromData = (data, offset, dataType) => {
    switch (dataType) {
        case TupleNumericType.U8:
            return new bn_js_1.default(data[offset], 'le');
        case TupleNumericType.U16:
            return new bn_js_1.default(data.slice(offset, offset + 2), 'le');
        case TupleNumericType.U32:
            return new bn_js_1.default(data.slice(offset, offset + 4), 'le');
        case TupleNumericType.U64:
            return new bn_js_1.default(data.slice(offset, offset + 8), 'le');
    }
};
exports.getBNFromData = getBNFromData;
//# sourceMappingURL=tupleNumeric.js.map