"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExternalPriceAccount = exports.UpdateExternalPriceAccountArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const VaultProgram_1 = require("../VaultProgram");
const ExternalPriceAccount_1 = require("../accounts/ExternalPriceAccount");
const VaultProgram_2 = require("../VaultProgram");
class UpdateExternalPriceAccountArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = VaultProgram_1.VaultInstructions.UpdateExternalPriceAccount;
    }
}
exports.UpdateExternalPriceAccountArgs = UpdateExternalPriceAccountArgs;
_a = UpdateExternalPriceAccountArgs;
UpdateExternalPriceAccountArgs.SCHEMA = new Map([
    ...ExternalPriceAccount_1.ExternalPriceAccountData.SCHEMA,
    ..._a.struct([
        ['instruction', 'u8'],
        ['externalPriceAccount', ExternalPriceAccount_1.ExternalPriceAccountData],
    ]),
]);
class UpdateExternalPriceAccount extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { externalPriceAccount, externalPriceAccountData } = params;
        const data = UpdateExternalPriceAccountArgs.serialize({
            externalPriceAccount: externalPriceAccountData,
        });
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: externalPriceAccount,
                    isSigner: false,
                    isWritable: true,
                },
            ],
            programId: VaultProgram_2.VaultProgram.PUBKEY,
            data,
        }));
    }
}
exports.UpdateExternalPriceAccount = UpdateExternalPriceAccount;
//# sourceMappingURL=UpdateExternalPriceAccount.js.map