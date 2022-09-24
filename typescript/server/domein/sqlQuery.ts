import mysql, { MysqlError } from 'mysql';

export default async function sqlQuery(query: string, params: string[]): Promise<any> {
	return await new Promise((resolve, reject) => {
		const connection = mysql.createConnection({
			host: process.env.DATABASE_HOST,
			user: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_DATABASE,
		});

		connection.beginTransaction((error) => {
			if (error) {
				return connection.rollback(undefined, () => {
					connection.end(() => {
						reject(error);
					});
				});
			}

			connection.query(query, params, (error: MysqlError | null, results: any) => {
				if (error) {
					connection.end(() => {
						reject(error);
					});
				}

				connection.commit((error) => {
					if (error) {
						return connection.rollback(undefined, () => {
							connection.end(() => {
								reject(error);
							});
						});
					}
					return connection.end(() => {
						resolve({ error: false, results });
					});
				});
			});
		});
	}).catch((error) => {
		console.log(error);
		throw 'Error connecting to database';
	});
}
