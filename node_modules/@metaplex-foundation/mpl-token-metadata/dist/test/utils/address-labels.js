"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKeyOf = exports.addLabel = void 0;
const amman_1 = require("@metaplex-foundation/amman");
const _1 = require(".");
const persistLabelsPath = process.env.ADDRESS_LABEL_PATH;
const knownLabels = { ['metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s']: 'mpl-token-metadata' };
const addressLabels = new amman_1.AddressLabels(knownLabels, _1.logDebug, persistLabelsPath);
exports.addLabel = addressLabels.addLabel;
exports.isKeyOf = addressLabels.isKeyOf;
//# sourceMappingURL=address-labels.js.map