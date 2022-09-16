"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayload = exports.validatePostInput = exports.addContentToDatabase = exports.getLatestEditContentData = exports.sqlQuery = void 0;
const mysql_1 = __importDefault(require("mysql"));
const dotenv = __importStar(require("dotenv"));
const config_1 = __importDefault(require("../config/config"));
dotenv.config();
const maxDaysToBlock = 5;
const sqlQuery = (query, params) => new Promise((resolve) => {
    try {
        const connection = mysql_1.default.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
        });
        connection.beginTransaction((error) => {
            if (error)
                return connection.rollback();
            connection.query(query, params, (error, results) => {
                if (error)
                    throw error;
                connection.commit((error) => {
                    if (error) {
                        return connection.rollback(() => {
                            throw error;
                        });
                    }
                    return resolve({ error: false, results });
                });
            });
        });
    }
    catch (error) {
        return resolve({ error: true });
    }
});
exports.sqlQuery = sqlQuery;
const getLatestEditContentData = () => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield sqlQuery('SELECT timeLeftUnix as timeUntilEdit, editedcontent.createdDate as submitDate, name, headerText, titleText, imageLink, imageAlt FROM editedcontent JOIN users ON editedcontent.user_id = users.id ORDER BY editedcontent.createdDate DESC LIMIT 1', []);
        if (result.error)
            return resolve('There has been an error with the database, please contact the administrator');
        if (result.results.length === 0)
            return resolve({});
        if (result.results.length === 1)
            return resolve(result.results[0]);
        else
            return resolve('Got more results then allowed, therefore the website is temperarly on lockdown');
    }));
};
exports.getLatestEditContentData = getLatestEditContentData;
const addContentToDatabase = (body) => new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const queryUserExist = 'SELECT id as user_id FROM users WHERE name = ?';
        const queryUser = 'INSERT INTO users (name) VALUES(?)';
        const queryTimeLeft = `INSERT INTO editedcontent (timeLeftUnix, user_id, headerText, titleText, imageLink, imageAlt) VALUES(?, ?, ?, ?, ?, ?)`;
        const user = yield sqlQuery(queryUserExist, [body.name]);
        let user_id = (_b = (_a = user.results[0]) === null || _a === void 0 ? void 0 : _a.user_id) !== null && _b !== void 0 ? _b : -1;
        if (user_id === -1)
            user_id = (yield sqlQuery(queryUser, [body.name])).results.insertId;
        yield sqlQuery(queryTimeLeft, [body.timeUntillNextEdit, user_id.toString(), body.headerText, body.titleText, body.imageLink, body.imageAlt]);
        return resolve({ error: false });
    }
    catch (error) {
        return resolve({ error: true, errorMessage: error.message });
    }
}));
exports.addContentToDatabase = addContentToDatabase;
const validatePostInput = (req) => {
    const body = req.body;
    if (body === null || body === undefined)
        throw 'Payload is undefined';
    console.log(body);
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
    maxDate.setDate(maxDate.getDate() + maxDaysToBlock);
    if (new Date(parseInt(body.timeUntillNextEdit)) > maxDate)
        throw 'TimeUntillNextEdit exceeds max date';
    return body;
};
exports.validatePostInput = validatePostInput;
const getPayload = () => __awaiter(void 0, void 0, void 0, function* () {
    const maxDate = new Date();
    const minDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxDaysToBlock);
    minDate.setDate(minDate.getDate() + 1);
    const datePickermin = minDate.toISOString().slice(0, 10);
    const datePickermax = maxDate.toISOString().slice(0, 10);
    const editContentLatestData = (yield getLatestEditContentData());
    let error = false;
    let errorMessage = '';
    if (typeof editContentLatestData === 'string')
        error = true;
    if (error)
        errorMessage = editContentLatestData;
    const payload = Object.assign(Object.assign({}, editContentLatestData), { error, errorMessage, editContentUrl: config_1.default.addDataRoute, minEditDate: datePickermin, maxEditDate: datePickermax });
    return payload;
});
exports.getPayload = getPayload;
