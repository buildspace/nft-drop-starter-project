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
exports.Program = void 0;
const web3_js_1 = require("@solana/web3.js");
const accounts_1 = require("./accounts");
const buffer_1 = require("buffer");
class Program {
    static findProgramAddress(seeds) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield web3_js_1.PublicKey.findProgramAddress(seeds, this.PUBKEY))[0];
        });
    }
    static getProgramAccounts(connection, configOrCommitment) {
        return __awaiter(this, void 0, void 0, function* () {
            const extra = {};
            let commitment;
            if (configOrCommitment) {
                if (typeof configOrCommitment === 'string') {
                    commitment = configOrCommitment;
                }
                else {
                    commitment = configOrCommitment.commitment;
                    if (configOrCommitment.dataSlice) {
                        extra.dataSlice = configOrCommitment.dataSlice;
                    }
                    if (configOrCommitment.filters) {
                        extra.filters = configOrCommitment.filters;
                    }
                }
            }
            const args = connection._buildArgs([this.PUBKEY.toBase58()], commitment, 'base64', extra);
            const unsafeRes = yield connection._rpcRequest('getProgramAccounts', args);
            return unsafeRes.result
                .map(({ account: { data, executable, lamports, owner }, pubkey }) => ({
                account: {
                    data: buffer_1.Buffer.from(data[0], 'base64'),
                    executable,
                    lamports,
                    owner: new web3_js_1.PublicKey(owner),
                },
                pubkey: new web3_js_1.PublicKey(pubkey),
            }))
                .map(({ pubkey, account }) => new accounts_1.Account(pubkey, account));
        });
    }
}
exports.Program = Program;
//# sourceMappingURL=Program.js.map