let editContentButton: HTMLButtonElement;
let editContentButtonContainer: HTMLDivElement;
let datePicker: HTMLInputElement;
let dateUnix: HTMLInputElement;
let editContentForm: HTMLFormElement;

const maxDaysToBlock = 5;

const setup = (): void => {
	editContentButton = document.getElementById('editContentButton') as HTMLButtonElement;
	editContentButtonContainer = document.getElementById('editContentButtonContainer') as HTMLDivElement;
	dateUnix = document.getElementById('dateUnix') as HTMLInputElement;
	editContentForm = document.querySelector('form') as HTMLFormElement;

	editContentButton.addEventListener('click', handlePageEditButton);

	datePicker = document.getElementById('date') as HTMLInputElement;

	editContentForm.addEventListener('submit', handleEditContentSubmit);

	handleCountDown();
};

const showErrorMessage = (error: string): void => {
	console.log(error);
};

const handleCountDown = async (): Promise<any> => {
	const timeToEdit = document.getElementById('timeToEdit') as HTMLLIElement;
	const fetchUrl = `http://${location.host}/latest`;
	const user: any = await (await fetch(fetchUrl)).json();

	console.log('%c Last Editor Details ', 'font-size: 1rem; font-weight: bold; background-color: yellow; color: black;');
	console.table(user);

	if (user.error) return;

	const timeRemainingUnix: Date = new Date(parseInt(user.timeUntilEdit));
	if (timeRemainingUnix <= new Date()) return (timeToEdit.innerHTML = 'Page is editable');

	setInterval(() => {
		const currentTime: Date = new Date();
		const seconds = Math.abs(Math.floor((timeRemainingUnix.getTime() - currentTime.getTime()) / 1000));
		const day = Math.floor(seconds / (3600 * 24));
		const hour = Math.floor((seconds % (3600 * 24)) / 3600);
		const min = Math.floor((seconds % 3600) / 60);
		const sec = Math.floor(seconds % 60);
		timeToEdit.innerText = `${day} day(s) - ${hour} hour(s) - ${min} minute(s) - ${sec} second(s)`;
	}, 1000);
};

const handlePageEditButton = (): void => {
	editContentButtonContainer.classList.toggle('hidden');
};

const handleEditContentSubmit = (): void => {
	dateUnix.value = new Date(datePicker.value).getTime().toString();
};

window.addEventListener('load', setup);
