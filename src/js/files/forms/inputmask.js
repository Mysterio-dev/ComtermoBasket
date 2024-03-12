import { flsModules } from "../modules.js";

// Подключение модуля
import "inputmask/dist/inputmask.min.js";

const inputMasksPhone = document.querySelectorAll('.phone-mask');

if (inputMasksPhone.length) {
	flsModules.inputMasksPhone = Inputmask({"mask": "+7(999) 999-99-99"}).mask(inputMasksPhone);
};

