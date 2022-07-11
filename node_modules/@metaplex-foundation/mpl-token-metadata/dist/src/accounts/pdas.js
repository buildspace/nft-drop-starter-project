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
Object.defineProperty(exports, "__esModule", { value: true });
exports.programAsBurner = void 0;
const web3_js_1 = require("@solana/web3.js");
const MetadataProgram_1 = require("../MetadataProgram");
function programAsBurner() {
    return __awaiter(this, void 0, void 0, function* () {
        return web3_js_1.PublicKey.findProgramAddress([Buffer.from('metadata'), MetadataProgram_1.MetadataProgram.PUBKEY.toBuffer(), Buffer.from('burn')], MetadataProgram_1.MetadataProgram.PUBKEY);
    });
}
exports.programAsBurner = programAsBurner;
//# sourceMappingURL=pdas.js.map