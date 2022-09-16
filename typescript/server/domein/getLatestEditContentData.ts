import sqlQuery from './sqlQuery';

export default function getLatestEditContentData(): Promise<contentBody> {
	return new Promise<contentBody>(async (resolve: any) => {
		const result = await sqlQuery(
			'SELECT timeLeftUnix as timeUntilEdit, editedcontent.createdDate as submitDate, name, headerText, titleText, imageLink, imageAlt FROM editedcontent JOIN users ON editedcontent.user_id = users.id ORDER BY editedcontent.createdDate DESC LIMIT 1',
			[],
		);

		if (result.error) return resolve('There has been an error with the database, please contact the administrator');
		if (result.results.length === 0) return resolve({} as contentBody);
		if (result.results.length === 1) return resolve(result.results[0] as contentBody);
		else return resolve('Got more results then allowed, therefore the website is temperarly on lockdown');
	});
}
