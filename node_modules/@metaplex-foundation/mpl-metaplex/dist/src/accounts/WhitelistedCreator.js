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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhitelistedCreator = exports.WhitelistedCreatorData = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const MetaplexProgram_1 = require("../MetaplexProgram");
const buffer_1 = require("buffer");
const web3_js_1 = require("@solana/web3.js");
class WhitelistedCreatorData extends mpl_core_1.Borsh.Data {
    constructor(args) {
        super(args);
        this.key = MetaplexProgram_1.MetaplexKey.WhitelistedCreatorV1;
        this.activated = true;
        this.key = MetaplexProgram_1.MetaplexKey.WhitelistedCreatorV1;
    }
}
exports.WhitelistedCreatorData = WhitelistedCreatorData;
_a = WhitelistedCreatorData;
WhitelistedCreatorData.SCHEMA = _a.struct([
    ['key', 'u8'],
    ['address', 'pubkeyAsString'],
    ['activated', 'u8'],
]);
class WhitelistedCreator extends mpl_core_1.Account {
    constructor(pubkey, info) {
        super(pubkey, info);
        if (!this.assertOwner(MetaplexProgram_1.MetaplexProgram.PUBKEY)) {
            throw (0, mpl_core_1.ERROR_INVALID_OWNER)();
        }
        if (!WhitelistedCreator.isCompatible(this.info.data)) {
            throw (0, mpl_core_1.ERROR_INVALID_ACCOUNT_DATA)();
        }
        this.data = WhitelistedCreatorData.deserialize(this.info.data);
    }
    static isCompatible(data) {
        return data[0] === MetaplexProgram_1.MetaplexKey.WhitelistedCreatorV1;
    }
    static getPDA(store, creator) {
        return __awaiter(this, void 0, void 0, function* () {
            return MetaplexProgram_1.MetaplexProgram.findProgramAddress([
                buffer_1.Buffer.from(MetaplexProgram_1.MetaplexProgram.PREFIX),
                MetaplexProgram_1.MetaplexProgram.PUBKEY.toBuffer(),
                new web3_js_1.PublicKey(store).toBuffer(),
                new web3_js_1.PublicKey(creator).toBuffer(),
            ]);
        });
    }
}
exports.WhitelistedCreator = WhitelistedCreator;
//# sourceMappingURL=WhitelistedCreator.js.map