export const serverConfig: serverConfigType = {
	indexRoute: '/',
	getDataRoute: '/latest',
	addDataRoute: '/update',
	port: process.env.PORT || 3000,
};

export const maxDaysToBlock = 5;
