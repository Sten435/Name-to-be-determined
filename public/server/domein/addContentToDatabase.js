"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlQuery_1 = __importDefault(require("./sqlQuery"));
const validateAccessCode_1 = require("./validateAccessCode");
function addContentToDatabase(body) {
    return new Promise(async (resolve) => {
        var _a, _b;
        try {
            const queryUserExist = 'SELECT id as user_id FROM users WHERE name = ?';
            const queryUser = 'INSERT INTO users (name) VALUES(?)';
            const queryTimeLeft = `INSERT INTO editedcontent (timeLeftUnix, user_id, headerText, titleText, imageLink, imageAlt) VALUES(?, ?, ?, ?, ?, ?)`;
            const user = await (0, sqlQuery_1.default)(queryUserExist, [body.name]);
            let user_id = (_b = (_a = user.results[0]) === null || _a === void 0 ? void 0 : _a.user_id) !== null && _b !== void 0 ? _b : -1;
            if (user_id === -1)
                user_id = (await (0, sqlQuery_1.default)(queryUser, [body.name])).results.insertId;
            await (0, sqlQuery_1.default)(queryTimeLeft, [
                body.timeUntillNextEdit,
                user_id.toString(),
                body.headerText,
                body.titleText,
                body.imageLink,
                body.imageAlt,
            ]);
            await (0, validateAccessCode_1.bindUserToCode)(body.name, body.code);
            return resolve({ error: false });
        }
        catch (error) {
            return resolve({ error: true, errorMessage: error.message });
        }
    });
}
exports.default = addContentToDatabase;
