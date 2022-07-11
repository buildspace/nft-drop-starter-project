"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountClient = void 0;
const camelcase_1 = __importDefault(require("camelcase"));
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const bs58 = __importStar(require("bs58"));
const web3_js_1 = require("@solana/web3.js");
const coder_1 = __importStar(require("../../coder"));
const common_1 = require("../common");
const __1 = require("../../");
const pubkeyUtil = __importStar(require("../../utils/pubkey"));
const rpcUtil = __importStar(require("../../utils/rpc"));
class AccountFactory {
    static build(idl, coder, programId, provider) {
        var _a;
        const accountFns = {};
        (_a = idl.accounts) === null || _a === void 0 ? void 0 : _a.forEach((idlAccount) => {
            const name = (0, camelcase_1.default)(idlAccount.name);
            accountFns[name] = new AccountClient(idl, idlAccount, programId, provider, coder);
        });
        return accountFns;
    }
}
exports.default = AccountFactory;
class AccountClient {
    constructor(idl, idlAccount, programId, provider, coder) {
        var _a;
        this._idlAccount = idlAccount;
        this._programId = programId;
        this._provider = provider !== null && provider !== void 0 ? provider : (0, __1.getProvider)();
        this._coder = coder !== null && coder !== void 0 ? coder : new coder_1.default(idl);
        this._size =
            coder_1.ACCOUNT_DISCRIMINATOR_SIZE + ((_a = (0, coder_1.accountSize)(idl, idlAccount)) !== null && _a !== void 0 ? _a : 0);
    }
    /**
     * Returns the number of bytes in this account.
     */
    get size() {
        return this._size;
    }
    /**
     * Returns the program ID owning all accounts.
     */
    get programId() {
        return this._programId;
    }
    /**
     * Returns the client's wallet and network provider.
     */
    get provider() {
        return this._provider;
    }
    /**
     * Returns the coder.
     */
    get coder() {
        return this._coder;
    }
    /**
     * Returns a deserialized account, returning null if it doesn't exist.
     *
     * @param address The address of the account to fetch.
     */
    async fetchNullable(address) {
        const accountInfo = await this._provider.connection.getAccountInfo((0, common_1.translateAddress)(address));
        if (accountInfo === null) {
            return null;
        }
        // Assert the account discriminator is correct.
        const discriminator = coder_1.AccountsCoder.accountDiscriminator(this._idlAccount.name);
        if (discriminator.compare(accountInfo.data.slice(0, 8))) {
            throw new Error("Invalid account discriminator");
        }
        return this._coder.accounts.decode(this._idlAccount.name, accountInfo.data);
    }
    /**
     * Returns a deserialized account.
     *
     * @param address The address of the account to fetch.
     */
    async fetch(address) {
        const data = await this.fetchNullable(address);
        if (data === null) {
            throw new Error(`Account does not exist ${address.toString()}`);
        }
        return data;
    }
    /**
     * Returns multiple deserialized accounts.
     * Accounts not found or with wrong discriminator are returned as null.
     *
     * @param addresses The addresses of the accounts to fetch.
     */
    async fetchMultiple(addresses) {
        const accounts = await rpcUtil.getMultipleAccounts(this._provider.connection, addresses.map((address) => (0, common_1.translateAddress)(address)));
        const discriminator = coder_1.AccountsCoder.accountDiscriminator(this._idlAccount.name);
        // Decode accounts where discriminator is correct, null otherwise
        return accounts.map((account) => {
            if (account == null) {
                return null;
            }
            if (discriminator.compare(account === null || account === void 0 ? void 0 : account.account.data.slice(0, 8))) {
                return null;
            }
            return this._coder.accounts.decode(this._idlAccount.name, account === null || account === void 0 ? void 0 : account.account.data);
        });
    }
    /**
     * Returns all instances of this account type for the program.
     *
     * @param filters User-provided filters to narrow the results from `connection.getProgramAccounts`.
     *
     *                When filters are not defined this method returns all
     *                the account instances.
     *
     *                When filters are of type `Buffer`, the filters are appended
     *                after the discriminator.
     *
     *                When filters are of type `GetProgramAccountsFilter[]`,
     *                filters are appended after the discriminator filter.
     */
    async all(filters) {
        const discriminator = coder_1.AccountsCoder.accountDiscriminator(this._idlAccount.name);
        let resp = await this._provider.connection.getProgramAccounts(this._programId, {
            commitment: this._provider.connection.commitment,
            filters: [
                {
                    memcmp: {
                        offset: 0,
                        bytes: bs58.encode(filters instanceof Buffer
                            ? Buffer.concat([discriminator, filters])
                            : discriminator),
                    },
                },
                ...(Array.isArray(filters) ? filters : []),
            ],
        });
        return resp.map(({ pubkey, account }) => {
            return {
                publicKey: pubkey,
                account: this._coder.accounts.decode(this._idlAccount.name, account.data),
            };
        });
    }
    /**
     * Returns an `EventEmitter` emitting a "change" event whenever the account
     * changes.
     */
    subscribe(address, commitment) {
        const sub = subscriptions.get(address.toString());
        if (sub) {
            return sub.ee;
        }
        const ee = new eventemitter3_1.default();
        address = (0, common_1.translateAddress)(address);
        const listener = this._provider.connection.onAccountChange(address, (acc) => {
            const account = this._coder.accounts.decode(this._idlAccount.name, acc.data);
            ee.emit("change", account);
        }, commitment);
        subscriptions.set(address.toString(), {
            ee,
            listener,
        });
        return ee;
    }
    /**
     * Unsubscribes from the account at the given address.
     */
    async unsubscribe(address) {
        let sub = subscriptions.get(address.toString());
        if (!sub) {
            console.warn("Address is not subscribed");
            return;
        }
        if (subscriptions) {
            await this._provider.connection
                .removeAccountChangeListener(sub.listener)
                .then(() => {
                subscriptions.delete(address.toString());
            })
                .catch(console.error);
        }
    }
    /**
     * Returns an instruction for creating this account.
     */
    async createInstruction(signer, sizeOverride) {
        const size = this.size;
        return web3_js_1.SystemProgram.createAccount({
            fromPubkey: this._provider.wallet.publicKey,
            newAccountPubkey: signer.publicKey,
            space: sizeOverride !== null && sizeOverride !== void 0 ? sizeOverride : size,
            lamports: await this._provider.connection.getMinimumBalanceForRentExemption(sizeOverride !== null && sizeOverride !== void 0 ? sizeOverride : size),
            programId: this._programId,
        });
    }
    /**
     * @deprecated since version 14.0.
     *
     * Function returning the associated account. Args are keys to associate.
     * Order matters.
     */
    async associated(...args) {
        const addr = await this.associatedAddress(...args);
        return await this.fetch(addr);
    }
    /**
     * @deprecated since version 14.0.
     *
     * Function returning the associated address. Args are keys to associate.
     * Order matters.
     */
    async associatedAddress(...args) {
        return await pubkeyUtil.associated(this._programId, ...args);
    }
}
exports.AccountClient = AccountClient;
// Tracks all subscriptions.
const subscriptions = new Map();
//# sourceMappingURL=account.js.map