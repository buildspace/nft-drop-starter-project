export { default as BN } from "bn.js";
import * as web3_1 from "@solana/web3.js";
export { web3_1 as web3 };
export { default as Provider, getProvider, setProvider, NodeWallet as Wallet, } from "./provider";
export { default as Coder, InstructionCoder, EventCoder, StateCoder, AccountsCoder, } from "./coder";
export * from "./error";
export { default as workspace } from "./workspace";
import * as utils_1 from "./utils";
export { utils_1 as utils };
export * from "./program";
//# sourceMappingURL=index.js.map