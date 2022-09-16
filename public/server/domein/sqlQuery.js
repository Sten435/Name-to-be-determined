"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
function sqlQuery(query, params) {
    return new Promise((resolve) => {
        const connection = mysql_1.default.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
        });
        connection.beginTransaction((error) => {
            if (error) {
                connection.rollback();
                throw error;
            }
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
    });
}
exports.default = sqlQuery;
