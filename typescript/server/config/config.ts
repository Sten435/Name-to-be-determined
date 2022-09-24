export const serverConfig: serverConfigType = {
	indexRoute: '/',
	getDataRoute: '/latest',
	addDataRoute: '/update',
	port: process.env.PORT || 3000,
};

export const CONSTANTS: constantsConfigType = {
	maxDaysToBlock: 2,
	maxInputCharLength: 255,
};
