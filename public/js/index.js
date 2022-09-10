"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const big_image = document.querySelector('#big_img');
const handleBigImageInteraction = (() => {
    try {
        if (big_image != null)
            big_image.addEventListener('click', () => {
                let input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/png, image/jpeg';
                input.onchange = (_this) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    let files = Array.from((_a = input.files) !== null && _a !== void 0 ? _a : []);
                    if (files.length === 1) {
                        const file = files[0];
                        big_image.src = yield readFile(file);
                    }
                });
                input.click();
            });
    }
    catch (error) {
        showErrorMessage(error);
    }
})();
const readFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (reader.result == null)
                throw Error('Error with file');
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            throw Error(error.toString());
        };
    });
});
function showErrorMessage(error) {
    console.log(error);
}
const displayCurrentYear = (() => {
    const currentYearSpan = document.getElementById('current_year');
    currentYearSpan.innerText = new Date().getFullYear().toString();
})();
