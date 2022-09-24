import { CONSTANTS } from '../config/config';
import getPayload from './getPayload';
import { isAccessCodeUnused } from './validateAccessCode';

export default async function validatePostInput(req: any): Promise<contentBody> {
	const body: contentBody = req.body;

	if (body === null || body === undefined) throw 'Payload is undefined';

	for (const key in body as any) {
		const value: any = body[key].toString();

		if (key.length <= 2) throw `Unknown key found, ${key}`;

		const capitalKey = key[0].toUpperCase() + key.substring(1);

		if (value === 'undefined' || value === 'null' || value === 'NaN' || value.trim() === '') throw `${capitalKey} is not valid`;
		if (value.length > 255) throw `${capitalKey} is to longer then the allowed size, max 255`;
	}

	if (body.name.trim().length <= 1) throw 'Name is not valid';

	if (typeof parseInt(body.timeUntillNextEdit.toString()) !== 'number') throw 'TimeUntillNextEdit is not a number';
	if (new Date(parseInt(body.timeUntillNextEdit as string)).toString() === 'Invalid Date') throw 'TimeUntillNextEdit is not a valid Date';
	if (new Date(parseInt(body.timeUntillNextEdit as string)) <= new Date()) throw 'TimeUntillNextEdit must be in the future';

	const maxDate = new Date();
	maxDate.setDate(maxDate.getDate() + CONSTANTS.maxDaysToBlock);

	if (new Date(parseInt(body.timeUntillNextEdit as string)) > maxDate) throw 'TimeUntillNextEdit exceeds max date';

	const reg = new RegExp(
		'(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
	);

	if (body.imageLink === undefined || body.imageLink === null) throw 'Link is required';
	if (!reg.test(body.imageLink)) throw 'Link is not valid';

	if (body.code === undefined || body.code === null) throw 'Code is required';

	const code: string = body.code;
	const valid: boolean = await isAccessCodeUnused(code);

	if (!valid) throw 'Code is not valid';

	const timeUntilEdit: Date = new Date(((await getPayload()) as any)?.timeUntilEdit as number);
	if (timeUntilEdit === null || timeUntilEdit > new Date()) throw "You can't edit the page, time is not already over";

	body.code = body.code.trim();

	body.imageLink = body.imageLink.trim();
	body.imageAlt = body.imageAlt.trim();

	body.headerText = body.headerText.trim();
	body.titleText = body.titleText.trim();

	body.name = body.name.trim();

	return body;
}
