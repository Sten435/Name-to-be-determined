export default async function tryCatchParser(res: any, functionRef: Function): Promise<any> {
	try {
		return await functionRef();
	} catch (error: any) {
		if (error === undefined && error.message === undefined) error = 'There has been an error, please try again';
		if (typeof error?.message === 'string' && error.message.length > 1) error = error.message;
		return res.json({ error: true, errorMessage: error });
	}
}
