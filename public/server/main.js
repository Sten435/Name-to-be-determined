"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config/config"));
const express_handlebars_1 = require("express-handlebars");
const app = (0, express_1.default)();
app.use('/styles', express_1.default.static('./public/styles'));
app.use('/js', express_1.default.static('./public/js'));
app.engine('handlebars', (0, express_handlebars_1.engine)());
app.set('view engine', 'handlebars');
app.set('views', './public/views');
app.get(config_1.default.indexRoute, (_req, res) => res.render('index', { stan: 'test' }));
app.listen(config_1.default.port, () => {
    console.log(`localhost:${config_1.default.port}`);
});
