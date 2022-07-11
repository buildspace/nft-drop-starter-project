"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetAuctionAuthority = exports.SetAuctionAuthorityArgs = void 0;
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
const web3_js_1 = require("@solana/web3.js");
const AuctionProgram_1 = require("../AuctionProgram");
class SetAuctionAuthorityArgs extends mpl_core_1.Borsh.Data {
    constructor() {
        super(...arguments);
        this.instruction = 5;
    }
}
exports.SetAuctionAuthorityArgs = SetAuctionAuthorityArgs;
SetAuctionAuthorityArgs.SCHEMA = SetAuctionAuthorityArgs.struct([['instruction', 'u8']]);
class SetAuctionAuthority extends mpl_core_1.Transaction {
    constructor(options, params) {
        super(options);
        const { auction, currentAuthority, newAuthority } = params;
        const data = SetAuctionAuthorityArgs.serialize();
        this.add(new web3_js_1.TransactionInstruction({
            keys: [
                {
                    pubkey: auction,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: currentAuthority,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: newAuthority,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            programId: AuctionProgram_1.AuctionProgram.PUBKEY,
            data,
        }));
    }
}
exports.SetAuctionAuthority = SetAuctionAuthority;
//# sourceMappingURL=SetAuctionAuthority.js.map