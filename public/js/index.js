"use strict";
let editContentButton;
let editContentButtonContainer;
let datePicker;
let dateUnix;
let editContentForm;
const maxDaysToBlock = 5;
const setup = () => {
    editContentButton = document.getElementById('editContentButton');
    editContentButtonContainer = document.getElementById('editContentButtonContainer');
    dateUnix = document.getElementById('dateUnix');
    editContentForm = document.querySelector('form');
    editContentButton.addEventListener('click', handlePageEditButton);
    datePicker = document.getElementById('date');
    editContentForm.addEventListener('submit', handleEditContentSubmit);
    handleCountDown();
};
const showErrorMessage = (error) => {
    console.log(error);
};
const handleCountDown = async () => {
    const timeToEdit = document.getElementById('timeToEdit');
    const fetchUrl = `http://${location.host}/latest`;
    const user = await (await fetch(fetchUrl)).json();
    console.log('%c Last Editor Details ', 'font-size: 1rem; font-weight: bold; background-color: yellow; color: black;');
    console.table(user);
    if (user.error)
        return;
    const timeRemainingUnix = new Date(parseInt(user.timeUntilEdit));
    if (timeRemainingUnix <= new Date())
        return (timeToEdit.innerHTML = 'Page is editable');
    setInterval(() => {
        const currentTime = new Date();
        const seconds = Math.abs(Math.floor((timeRemainingUnix.getTime() - currentTime.getTime()) / 1000));
        const day = Math.floor(seconds / (3600 * 24));
        const hour = Math.floor((seconds % (3600 * 24)) / 3600);
        const min = Math.floor((seconds % 3600) / 60);
        const sec = Math.floor(seconds % 60);
        timeToEdit.innerText = `${day} day(s) - ${hour} hour(s) - ${min} minute(s) - ${sec} second(s)`;
    }, 1000);
};
const handlePageEditButton = () => {
    editContentButtonContainer.classList.toggle('hidden');
};
const handleEditContentSubmit = () => {
    dateUnix.value = new Date(datePicker.value).getTime().toString();
};
window.addEventListener('load', setup);
