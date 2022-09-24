import getLatestEditContentData from './getLatestEditContentData';
import { CONSTANTS, serverConfig } from '../config/config';
import { getAccessCode } from './validateAccessCode';

export default async function getPayload(): Promise<object> {
	const maxDate: Date = new Date();
	const minDate: Date = new Date();

	maxDate.setDate(maxDate.getDate() + CONSTANTS.maxDaysToBlock);
	minDate.setDate(minDate.getDate() + 1);
	const datePickermin: string = minDate.toISOString().slice(0, 10);
	const datePickermax: string = maxDate.toISOString().slice(0, 10);
	const editContentLatestData: any = (await getLatestEditContentData()) as contentBody | string;

	let error = false;
	let errorMessage: string = '';

	if (typeof editContentLatestData === 'string') error = true;

	if (error) errorMessage = editContentLatestData as string;
	const payload = {
		...editContentLatestData,
		error,
		errorMessage,
		editContentUrl: serverConfig.addDataRoute,
		minEditDate: datePickermin,
		maxEditDate: datePickermax,
		code: await getAccessCode(),
	};

	return payload;
}
