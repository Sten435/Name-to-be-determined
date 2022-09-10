import express from 'express';
// import { getPage } from './helper/helper'
import serverConfig from './config/config';
import { engine } from 'express-handlebars';

const app = express();
app.use('/styles', express.static('./public/styles'));
app.use('/js', express.static('./public/js'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './public/views');

app.get(serverConfig.indexRoute, (_req, res): void => res.render('index', { stan: 'test' }));

app.listen(serverConfig.port, (): void => {
	console.log(`localhost:${serverConfig.port}`);
});
