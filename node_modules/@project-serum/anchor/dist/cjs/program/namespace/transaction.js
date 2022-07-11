"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const context_1 = require("../context");
class TransactionFactory {
    static build(idlIx, ixFn) {
        const txFn = (...args) => {
            var _a;
            const [, ctx] = (0, context_1.splitArgsAndCtx)(idlIx, [...args]);
            const tx = new web3_js_1.Transaction();
            (_a = ctx.instructions) === null || _a === void 0 ? void 0 : _a.forEach((ix) => tx.add(ix));
            tx.add(ixFn(...args));
            return tx;
        };
        return txFn;
    }
}
exports.default = TransactionFactory;
//# sourceMappingURL=transaction.js.map