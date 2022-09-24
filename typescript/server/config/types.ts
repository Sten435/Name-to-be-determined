type serverConfigType = {
	indexRoute: string;
	getDataRoute: string;
	addDataRoute: string;
	port: number | string;
};

type contentBody = {
	[key: string]: any;
	timeUntillNextEdit: string | number;
	name: string;
	headerText: string;
	titleText: string;
	imageLink: string;
	imageAlt: string;
	code: string;
};

type constantsConfigType = {
	maxDaysToBlock: number;
	maxInputCharLength: number;
};
