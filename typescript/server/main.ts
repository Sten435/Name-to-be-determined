var bodyParser = require('body-parser');
import express from 'express';
import { engine } from 'express-handlebars';
import dotenv from 'dotenv';

//Domein imports
import validatePostInput from './domein/validatePostInput';
import addContentToDatabase from './domein/addContentToDatabase';
import getPayload from './domein/getPayload';
import getLatestEditContentData from './domein/getLatestEditContentData';
import { serverConfig } from './config/config';
import { checkNewCode } from './domein/validateAccessCode';
import tryCatchParser from './domein/tryCatchParser';

const app = express();
app.use('/styles', express.static('./public/styles'));
app.use('/js', express.static('./public/js'));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
		limit: '2mb',
	}),
);
app.use(async (err: any, _req: any, _res: any, next: any) => {
	tryCatchParser(_res, () => {
		if (err) return _res.sendStatus(400);
		next();
	});
});
app.use(async (_req: any, _res: any, next: any) => {
	tryCatchParser(_res, async () => {
		await checkNewCode();
		next();
	});
});

app.engine('handlebars', engine());

app.set('view engine', 'handlebars');
app.set('views', './public/views');

dotenv.config();

app.get(
	serverConfig.indexRoute,
	async (_req: any, res: any): Promise<void> => (await tryCatchParser(res, async () => res.render('index', await getPayload()))) as Promise<any>,
);
app.get(
	serverConfig.getDataRoute,
	async (_req: any, res: any): Promise<any> => (await tryCatchParser(res, async () => res.json(await getLatestEditContentData()))) as Promise<any>,
);

app.post(
	serverConfig.addDataRoute,
	async (req: any, res: any) =>
		(await tryCatchParser(res, async () => res.json(await addContentToDatabase(await validatePostInput(req))))) as Promise<any>,
);

app.listen(serverConfig.port, () => console.log(`http://localhost:${serverConfig.port}`));
