import sqlQuery from './sqlQuery';
import { v4 as uuidv4 } from 'uuid';

export async function isAccessCodeUnused(code: string): Promise<boolean> {
	const query: string = 'SELECT "" FROM accesscode WHERE code = ? AND isUsed = 0 LIMIT 1';
	const result: any = (await sqlQuery(query, [code])).results as any;

	if (result.length === 1) return true;
	return false;
}

export async function checkNewCode(): Promise<void> {
	const query: string = 'SELECT "" FROM accesscode WHERE isUsed = 0';
	const result: any = (await sqlQuery(query, [])).results as any;

	if (result.length === 0) {
		const query: string = 'INSERT INTO accesscode (code) VALUES (?)';
		const code: string = uuidv4();
		
		(await sqlQuery(query, [code])) as any;
	} else if (result.length > 1) throw 'There are more than allowed active codes';
}

export async function bindUserToCode(user: string, code: string): Promise<void> {
	let query: string = 'SELECT id FROM users WHERE name = ? LIMIT 1';
	const result = await sqlQuery(query, [user]);
	const userId: number = result.results[0].id as number;

	query = 'UPDATE accesscode SET isUsed = 1, userId = ? WHERE code = ? LIMIT 1';
	(await sqlQuery(query, [userId.toString(), code])) as any;
}

export async function getAccessCode(): Promise<string> {
	let query: string = 'SELECT code FROM accesscode WHERE isUsed = 0 AND userId IS NULL AND usedAt IS NULL LIMIT 1';
	const result = await sqlQuery(query, []);

	if (result.results.length === 1) return result.results[0].code as string;
	throw 'Error while getting code';
}
