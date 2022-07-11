import { PublicKey } from "@solana/web3.js";
import Coder from "../../coder";
import Provider from "../../provider";
import { Idl } from "../../idl";
import { StateClient } from "./state";
import { InstructionNamespace } from "./instruction";
import { TransactionNamespace } from "./transaction";
import { RpcNamespace } from "./rpc";
import { AccountNamespace } from "./account";
import { SimulateNamespace } from "./simulate";
export { StateClient } from "./state";
export { InstructionNamespace, InstructionFn } from "./instruction";
export { TransactionNamespace, TransactionFn } from "./transaction";
export { RpcNamespace, RpcFn } from "./rpc";
export { AccountNamespace, AccountClient, ProgramAccount } from "./account";
export { SimulateNamespace, SimulateFn } from "./simulate";
export { IdlAccounts, IdlTypes } from "./types";
export default class NamespaceFactory {
    /**
     * Generates all namespaces for a given program.
     */
    static build<IDL extends Idl>(idl: IDL, coder: Coder, programId: PublicKey, provider: Provider): [
        RpcNamespace<IDL>,
        InstructionNamespace<IDL>,
        TransactionNamespace<IDL>,
        AccountNamespace<IDL>,
        SimulateNamespace<IDL>,
        StateClient<IDL> | undefined
    ];
}
//# sourceMappingURL=index.d.ts.map