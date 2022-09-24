import sqlQuery from './sqlQuery';
import { bindUserToCode } from './validateAccessCode';

export default function addContentToDatabase(body: contentBody): Promise<any> {
	return new Promise<contentBody>(async (resolve: any, reject: any) => {
		try {
			const queryUserExist: string = 'SELECT id as user_id FROM users WHERE name = ?';
			const queryUser: string = 'INSERT INTO users (name) VALUES(?)';
			const queryTimeLeft: string = `INSERT INTO editedcontent (timeLeftUnix, user_id, headerText, titleText, imageLink, imageAlt) VALUES(?, ?, ?, ?, ?, ?)`;

			const user: any = await sqlQuery(queryUserExist, [body.name]);
			let user_id: number = user.results[0]?.user_id ?? -1;

			if (user_id === -1) user_id = (await sqlQuery(queryUser, [body.name])).results.insertId;
			await sqlQuery(queryTimeLeft, [
				body.timeUntillNextEdit as string,
				user_id.toString(),
				body.headerText,
				body.titleText,
				body.imageLink,
				body.imageAlt,
			]);

			await bindUserToCode(body.name, body.code);

			return resolve({ error: false });
		} catch (error: any) {
			return reject({ error: true, errorMessage: error.message });
		}
	});
}
