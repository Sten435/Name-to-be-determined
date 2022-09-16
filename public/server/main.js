"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require('body-parser');
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = require("express-handlebars");
const dotenv_1 = __importDefault(require("dotenv"));
const validatePostInput_1 = __importDefault(require("./domein/validatePostInput"));
const addContentToDatabase_1 = __importDefault(require("./domein/addContentToDatabase"));
const getPayload_1 = __importDefault(require("./domein/getPayload"));
const getLatestEditContentData_1 = __importDefault(require("./domein/getLatestEditContentData"));
const config_1 = require("./config/config");
const validateAccessCode_1 = require("./domein/validateAccessCode");
const tryCatchParser_1 = __importDefault(require("./domein/tryCatchParser"));
const app = (0, express_1.default)();
app.use('/styles', express_1.default.static('./public/styles'));
app.use('/js', express_1.default.static('./public/js'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '2mb',
}));
app.use(async (err, _req, res, next) => {
    if (err)
        return res.sendStatus(400);
    next();
});
app.use(async (_req, _res, next) => {
    await (0, validateAccessCode_1.checkNewCode)();
    next();
});
app.engine('handlebars', (0, express_handlebars_1.engine)());
app.set('view engine', 'handlebars');
app.set('views', './public/views');
dotenv_1.default.config();
app.get(config_1.serverConfig.indexRoute, async (_req, res) => (await (0, tryCatchParser_1.default)(res, async () => res.render('index', await (0, getPayload_1.default)()))));
app.get(config_1.serverConfig.getDataRoute, async (_req, res) => (await (0, tryCatchParser_1.default)(res, async () => res.json(await (0, getLatestEditContentData_1.default)()))));
app.post(config_1.serverConfig.addDataRoute, async (req, res) => (await (0, tryCatchParser_1.default)(res, async () => res.json(await (0, addContentToDatabase_1.default)(await (0, validatePostInput_1.default)(req))))));
app.listen(config_1.serverConfig.port, () => console.log(`http://localhost:${config_1.serverConfig.port}`));
