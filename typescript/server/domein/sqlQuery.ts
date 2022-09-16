import mysql, { MysqlError } from 'mysql';

export default function sqlQuery(query: string, params: string[]): Promise<any> {
	return new Promise((resolve) => {
		const connection = mysql.createConnection({
			host: process.env.DATABASE_HOST,
			user: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_DATABASE,
		});
		connection.beginTransaction((error) => {
			if (error) {
				connection.rollback();
				throw error;
			}
			connection.query(query, params, (error: MysqlError | null, results: any) => {
				if (error) throw error;
				connection.commit((error) => {
					if (error) {
						return connection.rollback(() => {
							throw error;
						});
					}
					return resolve({ error: false, results });
				});
			});
		});
	});
}
