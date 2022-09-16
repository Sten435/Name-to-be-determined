"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxDaysToBlock = exports.serverConfig = void 0;
exports.serverConfig = {
    indexRoute: '/',
    getDataRoute: '/latest',
    addDataRoute: '/update',
    port: process.env.PORT || 3000,
};
exports.maxDaysToBlock = 5;
