"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function tryCatchParser(res, functionRef) {
    try {
        return await functionRef();
    }
    catch (error) {
        if (error === undefined && error.message === undefined)
            error = 'There has been an error, please try again';
        if (typeof (error === null || error === void 0 ? void 0 : error.message) === 'string' && error.message.length > 1)
            error = error.message;
        return res.json({ error: true, errorMessage: error });
    }
}
exports.default = tryCatchParser;
