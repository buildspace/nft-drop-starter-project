"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenStandard = exports.UseMethod = exports.MetadataKey = void 0;
var MetadataKey;
(function (MetadataKey) {
    MetadataKey[MetadataKey["Uninitialized"] = 0] = "Uninitialized";
    MetadataKey[MetadataKey["MetadataV1"] = 4] = "MetadataV1";
    MetadataKey[MetadataKey["EditionV1"] = 1] = "EditionV1";
    MetadataKey[MetadataKey["MasterEditionV1"] = 2] = "MasterEditionV1";
    MetadataKey[MetadataKey["MasterEditionV2"] = 6] = "MasterEditionV2";
    MetadataKey[MetadataKey["EditionMarker"] = 7] = "EditionMarker";
    MetadataKey[MetadataKey["UseAuthorityRecord"] = 8] = "UseAuthorityRecord";
    MetadataKey[MetadataKey["CollectionAuthorityRecord"] = 9] = "CollectionAuthorityRecord";
})(MetadataKey = exports.MetadataKey || (exports.MetadataKey = {}));
var UseMethod;
(function (UseMethod) {
    UseMethod[UseMethod["Burn"] = 0] = "Burn";
    UseMethod[UseMethod["Single"] = 1] = "Single";
    UseMethod[UseMethod["Multiple"] = 2] = "Multiple";
})(UseMethod = exports.UseMethod || (exports.UseMethod = {}));
var TokenStandard;
(function (TokenStandard) {
    TokenStandard[TokenStandard["NonFungible"] = 0] = "NonFungible";
    TokenStandard[TokenStandard["FungibleAsset"] = 1] = "FungibleAsset";
    TokenStandard[TokenStandard["Fungible"] = 2] = "Fungible";
    TokenStandard[TokenStandard["NonFungibleEdition"] = 3] = "NonFungibleEdition";
})(TokenStandard = exports.TokenStandard || (exports.TokenStandard = {}));
//# sourceMappingURL=constants.js.map