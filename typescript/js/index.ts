const big_image = document.querySelector<HTMLImageElement>('#big_img');

const handleBigImageInteraction = ((): void => {
	try {
		if (big_image != null)
			big_image.addEventListener('click', () => {
				let input = document.createElement('input');
				input.type = 'file';
				input.accept = 'image/png, image/jpeg';
				input.onchange = async (_this) => {
					let files: File[] = Array.from(input.files ?? []);
					if (files.length === 1) {
						const file: File = files[0];
						big_image.src = await readFile(file);
					}
				};
				input.click();
			});
	} catch (error) {
		showErrorMessage(error as string);
	}
})();

const readFile = async (file: File): Promise<string> =>
	new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			if (reader.result == null) throw Error('Error with file');
			resolve(reader.result as string);
		};
		reader.onerror = (error) => {
			throw Error(error.toString());
		};
	});

function showErrorMessage(error: string): void {
	console.log(error);
}

const displayCurrentYear = ((): void => {
	const currentYearSpan = document.getElementById('current_year') as HTMLSpanElement;
	currentYearSpan.innerText = new Date().getFullYear().toString();
})();
