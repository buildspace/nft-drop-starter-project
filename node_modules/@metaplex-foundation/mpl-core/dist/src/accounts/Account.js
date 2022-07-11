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
exports.Account = void 0;
const web3_js_1 = require("@solana/web3.js");
const buffer_1 = require("buffer");
const errors_1 = require("../errors");
class Account {
    constructor(pubkey, info) {
        this.pubkey = new web3_js_1.PublicKey(pubkey);
        this.info = info;
    }
    static from(account) {
        return new this(account.pubkey, account.info);
    }
    static load(connection, pubkey) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield Account.getInfo(connection, pubkey);
            return new this(pubkey, info);
        });
    }
    static isCompatible(_data) {
        throw new Error(`method 'isCompatible' is not implemented`);
    }
    static getInfo(connection, pubkey) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield connection.getAccountInfo(new web3_js_1.PublicKey(pubkey));
            if (!info) {
                throw (0, errors_1.ERROR_ACCOUNT_NOT_FOUND)(pubkey);
            }
            return Object.assign(Object.assign({}, info), { data: buffer_1.Buffer.from(info === null || info === void 0 ? void 0 : info.data) });
        });
    }
    static getInfos(connection, pubkeys, commitment = 'recent') {
        return __awaiter(this, void 0, void 0, function* () {
            const BATCH_SIZE = 99;
            const promises = [];
            for (let i = 0; i < pubkeys.length; i += BATCH_SIZE) {
                promises.push(Account.getMultipleAccounts(connection, pubkeys.slice(i, Math.min(pubkeys.length, i + BATCH_SIZE)), commitment));
            }
            const results = new Map();
            (yield Promise.all(promises)).forEach((result) => { var _a; return [...((_a = result === null || result === void 0 ? void 0 : result.entries()) !== null && _a !== void 0 ? _a : [])].forEach(([k, v]) => results.set(k, v)); });
            return results;
        });
    }
    static getMultipleAccounts(connection, pubkeys, commitment) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = connection._buildArgs([pubkeys.map((k) => k.toString())], commitment, 'base64');
            const unsafeRes = yield connection._rpcRequest('getMultipleAccounts', args);
            if (unsafeRes.error) {
                throw new Error('failed to get info about accounts ' + unsafeRes.error.message);
            }
            if (!unsafeRes.result.value)
                return;
            const infos = unsafeRes.result.value
                .filter(Boolean)
                .map((info) => (Object.assign(Object.assign({}, info), { data: buffer_1.Buffer.from(info.data[0], 'base64') })));
            return infos.reduce((acc, info, index) => {
                acc.set(pubkeys[index], info);
                return acc;
            }, new Map());
        });
    }
    assertOwner(pubkey) {
        var _a;
        return (_a = this.info) === null || _a === void 0 ? void 0 : _a.owner.equals(new web3_js_1.PublicKey(pubkey));
    }
    toJSON() {
        var _a, _b, _c, _d, _e;
        return {
            pubkey: this.pubkey.toString(),
            info: {
                executable: !!((_a = this.info) === null || _a === void 0 ? void 0 : _a.executable),
                owner: ((_b = this.info) === null || _b === void 0 ? void 0 : _b.owner) ? new web3_js_1.PublicKey((_c = this.info) === null || _c === void 0 ? void 0 : _c.owner) : null,
                lamports: (_d = this.info) === null || _d === void 0 ? void 0 : _d.lamports,
                data: (_e = this.info) === null || _e === void 0 ? void 0 : _e.data.toJSON(),
            },
            data: this.data,
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
exports.Account = Account;
//# sourceMappingURL=Account.js.map