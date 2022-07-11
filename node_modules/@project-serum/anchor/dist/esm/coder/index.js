import { InstructionCoder } from "./instruction";
import { AccountsCoder } from "./accounts";
import { EventCoder } from "./event";
import { StateCoder } from "./state";
import { sighash } from "./common";
export { accountSize } from "./common";
export { InstructionCoder } from "./instruction";
export { AccountsCoder, ACCOUNT_DISCRIMINATOR_SIZE } from "./accounts";
export { EventCoder, eventDiscriminator } from "./event";
export { StateCoder, stateDiscriminator } from "./state";
/**
 * Coder provides a facade for encoding and decoding all IDL related objects.
 */
export default class Coder {
    constructor(idl) {
        this.instruction = new InstructionCoder(idl);
        this.accounts = new AccountsCoder(idl);
        this.events = new EventCoder(idl);
        if (idl.state) {
            this.state = new StateCoder(idl);
        }
    }
    sighash(nameSpace, ixName) {
        return sighash(nameSpace, ixName);
    }
}
//# sourceMappingURL=index.js.map