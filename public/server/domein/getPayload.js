"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getLatestEditContentData_1 = __importDefault(require("./getLatestEditContentData"));
const config_1 = require("../config/config");
const validateAccessCode_1 = require("./validateAccessCode");
async function getPayload() {
    const maxDate = new Date();
    const minDate = new Date();
    maxDate.setDate(maxDate.getDate() + config_1.maxDaysToBlock);
    minDate.setDate(minDate.getDate() + 1);
    const datePickermin = minDate.toISOString().slice(0, 10);
    const datePickermax = maxDate.toISOString().slice(0, 10);
    const editContentLatestData = (await (0, getLatestEditContentData_1.default)());
    let error = false;
    let errorMessage = '';
    if (typeof editContentLatestData === 'string')
        error = true;
    if (error)
        errorMessage = editContentLatestData;
    const payload = Object.assign(Object.assign({}, editContentLatestData), { error,
        errorMessage, editContentUrl: config_1.serverConfig.addDataRoute, minEditDate: datePickermin, maxEditDate: datePickermax, code: await (0, validateAccessCode_1.getAccessCode)() });
    return payload;
}
exports.default = getPayload;
