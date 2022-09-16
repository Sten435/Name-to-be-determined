"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverConfig = {
    indexRoute: '/',
    getDataRoute: '/latest',
    AddDataRoute: '/add',
    port: process.env.PORT || 3000,
};
exports.default = serverConfig;
