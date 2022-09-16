"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessCode = exports.bindUserToCode = exports.checkNewCode = exports.isAccessCodeUnused = void 0;
const sqlQuery_1 = __importDefault(require("./sqlQuery"));
const uuid_1 = require("uuid");
async function isAccessCodeUnused(code) {
    const query = 'SELECT "" FROM accesscode WHERE code = ? AND isUsed = 0 LIMIT 1';
    const result = (await (0, sqlQuery_1.default)(query, [code])).results;
    if (result.length === 1)
        return true;
    return false;
}
exports.isAccessCodeUnused = isAccessCodeUnused;
async function checkNewCode() {
    const query = 'SELECT "" FROM accesscode WHERE isUsed = 0';
    const result = (await (0, sqlQuery_1.default)(query, [])).results;
    if (result.length === 0) {
        const query = 'INSERT INTO accesscode (code) VALUES (?)';
        const code = (0, uuid_1.v4)();
        (await (0, sqlQuery_1.default)(query, [code]));
    }
    else if (result.length > 1)
        throw 'There are more than allowed active codes';
}
exports.checkNewCode = checkNewCode;
async function bindUserToCode(user, code) {
    let query = 'SELECT id FROM users WHERE name = ? LIMIT 1';
    const result = await (0, sqlQuery_1.default)(query, [user]);
    const userId = result.results[0].id;
    query = 'UPDATE accesscode SET isUsed = 1, userId = ? WHERE code = ? LIMIT 1';
    (await (0, sqlQuery_1.default)(query, [userId.toString(), code]));
}
exports.bindUserToCode = bindUserToCode;
async function getAccessCode() {
    let query = 'SELECT code FROM accesscode WHERE isUsed = 0 AND userId IS NULL AND usedAt IS NULL LIMIT 1';
    const result = await (0, sqlQuery_1.default)(query, []);
    if (result.results.length === 1)
        return result.results[0].code;
    throw 'Error while getting code';
}
exports.getAccessCode = getAccessCode;
