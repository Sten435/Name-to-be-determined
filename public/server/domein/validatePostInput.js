"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const getPayload_1 = __importDefault(require("./getPayload"));
const validateAccessCode_1 = require("./validateAccessCode");
async function validatePostInput(req) {
    var _a;
    const body = req.body;
    if (body === null || body === undefined)
        throw 'Payload is undefined';
    if (body.name === undefined || body.name === null || body.name.trim().length <= 1)
        throw 'Name is not valid';
    if (body.timeUntillNextEdit === undefined || body.timeUntillNextEdit === null)
        throw 'TimeUntillNextEdit is not valid';
    if (typeof parseInt(body.timeUntillNextEdit.toString()) !== 'number')
        throw 'TimeUntillNextEdit is not a number';
    if (new Date(parseInt(body.timeUntillNextEdit)).toString() === 'Invalid Date')
        throw 'TimeUntillNextEdit is not a valid Date';
    if (new Date(parseInt(body.timeUntillNextEdit)) <= new Date())
        throw 'TimeUntillNextEdit must be in the future';
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + config_1.maxDaysToBlock);
    if (new Date(parseInt(body.timeUntillNextEdit)) > maxDate)
        throw 'TimeUntillNextEdit exceeds max date';
    if (body.code === undefined || body.code === null)
        throw 'Code is required';
    const code = body.code;
    const valid = await (0, validateAccessCode_1.isAccessCodeUnused)(code);
    if (!valid)
        throw 'Code is not valid';
    const timeUntilEdit = new Date((_a = ((await (0, getPayload_1.default)()))) === null || _a === void 0 ? void 0 : _a.timeUntilEdit);
    if (timeUntilEdit === null || timeUntilEdit > new Date())
        throw "You can't edit the page, time is not already over";
    return body;
}
exports.default = validatePostInput;
