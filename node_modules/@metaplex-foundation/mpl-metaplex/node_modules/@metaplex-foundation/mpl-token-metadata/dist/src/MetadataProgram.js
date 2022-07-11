"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataProgram = exports.MetadataKey = void 0;
const web3_js_1 = require("@solana/web3.js");
const mpl_core_1 = require("@metaplex-foundation/mpl-core");
var MetadataKey;
(function (MetadataKey) {
    MetadataKey[MetadataKey["Uninitialized"] = 0] = "Uninitialized";
    MetadataKey[MetadataKey["MetadataV1"] = 4] = "MetadataV1";
    MetadataKey[MetadataKey["EditionV1"] = 1] = "EditionV1";
    MetadataKey[MetadataKey["MasterEditionV1"] = 2] = "MasterEditionV1";
    MetadataKey[MetadataKey["MasterEditionV2"] = 6] = "MasterEditionV2";
    MetadataKey[MetadataKey["EditionMarker"] = 7] = "EditionMarker";
})(MetadataKey = exports.MetadataKey || (exports.MetadataKey = {}));
class MetadataProgram extends mpl_core_1.Program {
}
exports.MetadataProgram = MetadataProgram;
MetadataProgram.PREFIX = 'metadata';
MetadataProgram.PUBKEY = new web3_js_1.PublicKey(mpl_core_1.config.programs.metadata);
//# sourceMappingURL=MetadataProgram.js.map