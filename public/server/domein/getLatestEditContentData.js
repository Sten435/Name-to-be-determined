"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlQuery_1 = __importDefault(require("./sqlQuery"));
function getLatestEditContentData() {
    return new Promise(async (resolve) => {
        const result = await (0, sqlQuery_1.default)('SELECT timeLeftUnix as timeUntilEdit, editedcontent.createdDate as submitDate, name, headerText, titleText, imageLink, imageAlt FROM editedcontent JOIN users ON editedcontent.user_id = users.id ORDER BY editedcontent.createdDate DESC LIMIT 1', []);
        if (result.error)
            return resolve('There has been an error with the database, please contact the administrator');
        if (result.results.length === 0)
            return resolve({});
        if (result.results.length === 1)
            return resolve(result.results[0]);
        else
            return resolve('Got more results then allowed, therefore the website is temperarly on lockdown');
    });
}
exports.default = getLatestEditContentData;
