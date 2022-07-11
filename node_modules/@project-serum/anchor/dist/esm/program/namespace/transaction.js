import { Transaction } from "@solana/web3.js";
import { splitArgsAndCtx } from "../context";
export default class TransactionFactory {
    static build(idlIx, ixFn) {
        const txFn = (...args) => {
            var _a;
            const [, ctx] = splitArgsAndCtx(idlIx, [...args]);
            const tx = new Transaction();
            (_a = ctx.instructions) === null || _a === void 0 ? void 0 : _a.forEach((ix) => tx.add(ix));
            tx.add(ixFn(...args));
            return tx;
        };
        return txFn;
    }
}
//# sourceMappingURL=transaction.js.map