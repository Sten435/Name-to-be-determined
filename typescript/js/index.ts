let editContentButton: HTMLButtonElement;
let editContentButtonContainer: HTMLDivElement;
let alertContainer: HTMLDivElement;
let alertMessage: HTMLDivElement;

let imageLink: HTMLInputElement;
let datePicker: HTMLInputElement;
let hiddenInputTimeUntillNextEdit: HTMLInputElement;

let editContentForm: HTMLFormElement;

const setup = (): void => {
	editContentButton = document.getElementById('editContentButton') as HTMLButtonElement;
	editContentButton.addEventListener('click', handlePageEditButton);

	editContentButtonContainer = document.getElementById('editContentButtonContainer') as HTMLDivElement;

	hiddenInputTimeUntillNextEdit = document.getElementById('dateUnix') as HTMLInputElement;

	editContentForm = document.querySelector('form') as HTMLFormElement;
	editContentForm.addEventListener('submit', handleEditContentSubmit);

	datePicker = document.getElementById('date') as HTMLInputElement;

	alertContainer = document.getElementById('alertContainer') as HTMLDivElement;
	alertMessage = alertContainer.children[0] as HTMLDivElement;

	handleCountDown();
};

const handleCountDown = async (): Promise<any> => {
	const timeToEdit = document.getElementById('timeToEdit') as HTMLLIElement;
	const fetchUrl = `http://${location.host}/latest`;
	const user: any = await (await fetch(fetchUrl)).json();

	console.log('%c Last Editor Details ', 'font-size: 1rem; font-weight: bold; background-color: yellow; color: black;');
	console.table(user);

	if (user.error) return;

	const timeRemainingUnix: Date = new Date(parseInt(user.timeUntilEdit));
	if (timeRemainingUnix <= new Date() || user.hasData === false) return (timeToEdit.innerHTML = 'Page is editable');

	setInterval(() => {
		const currentTime: Date = new Date();
		if (timeRemainingUnix <= currentTime) return window.location.reload();
		const seconds = Math.abs(Math.floor((timeRemainingUnix.getTime() - currentTime.getTime()) / 1000));
		const day = Math.floor(seconds / (3600 * 24));
		const hour = Math.floor((seconds % (3600 * 24)) / 3600);
		const min = Math.floor((seconds % 3600) / 60);
		const sec = Math.floor(seconds % 60);
		timeToEdit.innerText = `${day} day(s) - ${hour} hour(s) - ${min} minute(s) - ${sec} second(s)`;
		document.title = `${day}/d - ${hour}/h - ${min}/m - ${sec}/s`;
	}, 1000);
};

const handlePageEditButton = (): void => {
	editContentButtonContainer.classList.toggle('hidden');
};

const handleEditContentSubmit = (e: any): void => {
	hiddenInputTimeUntillNextEdit.value = new Date(datePicker.value).getTime().toString();

	const url: string = (e.target as HTMLFormElement).action as string;

	const formData = new FormData(editContentForm);
	let payload: any = {};

	for (var [key, value] of formData.entries()) {
		payload[key] = value;
	}

	fetch(url, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-type': 'application/json',
		},
	})
		.then(async (data) => {
			const result = await data.json();

			if (result.error) {
				showAlert({
					message: result.errorMessage,
				});
			} else if (!result.error) {
				showAlert({
					error: false,
					message: 'Content successfully changed',
				});

				document.querySelector('main')!.innerHTML =
					"<div class='loadingContainer'><div class='lds-ring'><div></div><div></div><div></div><div></div></div></div>";

				setTimeout(() => {
					window.location.reload();
				}, 2500);
			}
		})
		.catch(() => console.log('There has been an error'));

	e.preventDefault();
};

const showAlert = ({ error = true, message = '', secondsToRead = 2 }: any) => {
	const resetContainer = (_secondsToRead: number = secondsToRead) => {
		setTimeout(() => {
			alertContainer.classList.remove('--alert');
			alertContainer.classList.remove('--error');
			return alertContainer.classList.remove('sliderAlert');
		}, secondsToRead * 1000);
	};

	resetContainer(0);

	if (!error) alertContainer.classList.add('--alert');
	else alertContainer.classList.add('--error');

	alertMessage.innerText = message;

	alertContainer.classList.add('sliderAlert');

	resetContainer();
};

window.addEventListener('load', setup);
