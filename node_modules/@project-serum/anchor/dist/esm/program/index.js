import { inflate } from "pako";
import { idlAddress, decodeIdlAccount } from "../idl";
import Coder from "../coder";
import NamespaceFactory from "./namespace";
import { getProvider } from "../";
import { utf8 } from "../utils/bytes";
import { EventManager } from "./event";
import { translateAddress } from "./common";
export * from "./common";
export * from "./context";
export * from "./event";
export * from "./namespace";
/**
 * ## Program
 *
 * Program provides the IDL deserialized client representation of an Anchor
 * program.
 *
 * This API is the one stop shop for all things related to communicating with
 * on-chain programs. Among other things, one can send transactions, fetch
 * deserialized accounts, decode instruction data, subscribe to account
 * changes, and listen to events.
 *
 * In addition to field accessors and methods, the object provides a set of
 * dynamically generated properties, also known as namespaces, that
 * map one-to-one to program methods and accounts. These namespaces generally
 *  can be used as follows:
 *
 * ## Usage
 *
 * ```javascript
 * program.<namespace>.<program-specific-method>
 * ```
 *
 * API specifics are namespace dependent. The examples used in the documentation
 * below will refer to the two counter examples found
 * [here](https://github.com/project-serum/anchor#examples).
 */
export class Program {
    /**
     * @param idl       The interface definition.
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context to use. If not provided
     *                  then uses [[getProvider]].
     */
    constructor(idl, programId, provider) {
        programId = translateAddress(programId);
        if (!provider) {
            provider = getProvider();
        }
        // Fields.
        this._idl = idl;
        this._provider = provider;
        this._programId = programId;
        this._coder = new Coder(idl);
        this._events = new EventManager(this._programId, provider, this._coder);
        // Dynamic namespaces.
        const [rpc, instruction, transaction, account, simulate, state,] = NamespaceFactory.build(idl, this._coder, programId, provider);
        this.rpc = rpc;
        this.instruction = instruction;
        this.transaction = transaction;
        this.account = account;
        this.simulate = simulate;
        this.state = state;
    }
    /**
     * Address of the program.
     */
    get programId() {
        return this._programId;
    }
    /**
     * IDL defining the program's interface.
     */
    get idl() {
        return this._idl;
    }
    /**
     * Coder for serializing requests.
     */
    get coder() {
        return this._coder;
    }
    /**
     * Wallet and network provider.
     */
    get provider() {
        return this._provider;
    }
    /**
     * Generates a Program client by fetching the IDL from the network.
     *
     * In order to use this method, an IDL must have been previously initialized
     * via the anchor CLI's `anchor idl init` command.
     *
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context.
     */
    static async at(address, provider) {
        const programId = translateAddress(address);
        const idl = await Program.fetchIdl(programId, provider);
        if (!idl) {
            throw new Error(`IDL not found for program: ${address.toString()}`);
        }
        return new Program(idl, programId, provider);
    }
    /**
     * Fetches an idl from the blockchain.
     *
     * In order to use this method, an IDL must have been previously initialized
     * via the anchor CLI's `anchor idl init` command.
     *
     * @param programId The on-chain address of the program.
     * @param provider  The network and wallet context.
     */
    static async fetchIdl(address, provider) {
        provider = provider !== null && provider !== void 0 ? provider : getProvider();
        const programId = translateAddress(address);
        const idlAddr = await idlAddress(programId);
        const accountInfo = await provider.connection.getAccountInfo(idlAddr);
        if (!accountInfo) {
            return null;
        }
        // Chop off account discriminator.
        let idlAccount = decodeIdlAccount(accountInfo.data.slice(8));
        const inflatedIdl = inflate(idlAccount.data);
        return JSON.parse(utf8.decode(inflatedIdl));
    }
    /**
     * Invokes the given callback every time the given event is emitted.
     *
     * @param eventName The PascalCase name of the event, provided by the IDL.
     * @param callback  The function to invoke whenever the event is emitted from
     *                  program logs.
     */
    addEventListener(eventName, callback) {
        return this._events.addEventListener(eventName, callback);
    }
    /**
     * Unsubscribes from the given eventName.
     */
    async removeEventListener(listener) {
        return await this._events.removeEventListener(listener);
    }
}
//# sourceMappingURL=index.js.map