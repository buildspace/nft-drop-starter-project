"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_ACCOUNT_NOT_FOUND = exports.ERROR_DEPRECATED_ACCOUNT_DATA = exports.ERROR_INVALID_ACCOUNT_DATA = exports.ERROR_INVALID_OWNER = exports.MetaplexError = exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["ERROR_INVALID_OWNER"] = 0] = "ERROR_INVALID_OWNER";
    ErrorCode[ErrorCode["ERROR_INVALID_ACCOUNT_DATA"] = 1] = "ERROR_INVALID_ACCOUNT_DATA";
    ErrorCode[ErrorCode["ERROR_DEPRECATED_ACCOUNT_DATA"] = 2] = "ERROR_DEPRECATED_ACCOUNT_DATA";
    ErrorCode[ErrorCode["ERROR_ACCOUNT_NOT_FOUND"] = 3] = "ERROR_ACCOUNT_NOT_FOUND";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
class MetaplexError extends Error {
    constructor(errorCode, message) {
        super(message);
        this.errorCode = errorCode;
    }
}
exports.MetaplexError = MetaplexError;
const ERROR_INVALID_OWNER = () => {
    return new MetaplexError(ErrorCode.ERROR_INVALID_OWNER, 'Invalid owner');
};
exports.ERROR_INVALID_OWNER = ERROR_INVALID_OWNER;
const ERROR_INVALID_ACCOUNT_DATA = () => {
    return new MetaplexError(ErrorCode.ERROR_INVALID_ACCOUNT_DATA, 'Invalid data');
};
exports.ERROR_INVALID_ACCOUNT_DATA = ERROR_INVALID_ACCOUNT_DATA;
const ERROR_DEPRECATED_ACCOUNT_DATA = () => {
    return new MetaplexError(ErrorCode.ERROR_DEPRECATED_ACCOUNT_DATA, 'Account data is deprecated');
};
exports.ERROR_DEPRECATED_ACCOUNT_DATA = ERROR_DEPRECATED_ACCOUNT_DATA;
const ERROR_ACCOUNT_NOT_FOUND = (pubkey) => {
    return new MetaplexError(ErrorCode.ERROR_ACCOUNT_NOT_FOUND, `Unable to find account: ${pubkey}`);
};
exports.ERROR_ACCOUNT_NOT_FOUND = ERROR_ACCOUNT_NOT_FOUND;
//# sourceMappingURL=errors.js.map