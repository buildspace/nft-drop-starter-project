"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const web3_js_1 = require("@solana/web3.js");
class Transaction extends web3_js_1.Transaction {
    constructor(options) {
        super(options);
    }
    static fromCombined(transactions, options = {}) {
        const combinedTransaction = new Transaction(options);
        transactions.forEach((transaction) => transaction.instructions.forEach((instruction) => {
            combinedTransaction.add(instruction);
        }));
        return combinedTransaction;
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map