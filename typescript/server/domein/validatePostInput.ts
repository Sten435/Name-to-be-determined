import { maxDaysToBlock } from '../config/config';
import getPayload from './getPayload';
import { isAccessCodeUnused } from './validateAccessCode';

export default async function validatePostInput(req: any): Promise<contentBody> {
	const body: contentBody = req.body;

	if (body === null || body === undefined) throw 'Payload is undefined';

	if (body.name === undefined || body.name === null || body.name.trim().length <= 1) throw 'Name is not valid';

	if (body.timeUntillNextEdit === undefined || body.timeUntillNextEdit === null) throw 'TimeUntillNextEdit is not valid';
	if (typeof parseInt(body.timeUntillNextEdit.toString()) !== 'number') throw 'TimeUntillNextEdit is not a number';
	if (new Date(parseInt(body.timeUntillNextEdit as string)).toString() === 'Invalid Date') throw 'TimeUntillNextEdit is not a valid Date';
	if (new Date(parseInt(body.timeUntillNextEdit as string)) <= new Date()) throw 'TimeUntillNextEdit must be in the future';

	const maxDate = new Date();
	maxDate.setDate(maxDate.getDate() + maxDaysToBlock);

	if (new Date(parseInt(body.timeUntillNextEdit as string)) > maxDate) throw 'TimeUntillNextEdit exceeds max date';

	if (body.code === undefined || body.code === null) throw 'Code is required';

	const code: string = body.code;
	const valid: boolean = await isAccessCodeUnused(code);

	if (!valid) throw 'Code is not valid';

	const timeUntilEdit: Date = new Date(((await getPayload()) as any)?.timeUntilEdit as number);
	if (timeUntilEdit === null || timeUntilEdit > new Date()) throw "You can't edit the page, time is not already over";

	return body;
}
