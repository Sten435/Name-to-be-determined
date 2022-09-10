type serverConfigType = {
	indexRoute: string;
	port: number | string;
};

// end types

const serverConfig: serverConfigType = {
	indexRoute: '/',
	port: process.env.PORT || 80,
};

export default serverConfig;
