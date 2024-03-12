import { flsModules } from "../modules.js";

import {
  isMobile,
  _slideUp,
  _slideDown,
  _slideToggle,
  FLS,
} from "../functions.js";
// Модуль прокрутки к блоку
import { gotoBlock } from "../scroll/gotoblock.js";

import Toastify from "toastify-js";
//================================================================================================================================================================================================================================================================================================================================

/*
Чтобы поле участвовало в валидации добавляем атрибут data-required
Особые проверки:
data-required="email" - вадидация E-mail

Чтобы поле валидировалось при потере фокуса, 
к атрибуту data-required добавляем атрибут data-validate

Чтобы вывести текст ошибки, нужно указать его в атрибуте data-error

data-popup-message - указываем селектор попапа который нужно показать после отправки формы (режимы data-ajax или data-dev) ! необходимо подключить функционал попапов в app.js
data-ajax - отправляем данные формы AJAX запросом по адресу указанному в action методом указанным в method
data-dev - режим разработчика - эмитируем отправку формы
data-goto-error - прокрутить страницу к ошибке
*/

// Работа с полями формы. Добавление классов, работа с placeholder
export function formFieldsInit(options = { viewPass: false }) {
  // Если включено, добавляем функционал "скрыть плейсходлер при фокусе"
  const formFields = document.querySelectorAll(
    "input[placeholder],textarea[placeholder]"
  );
  if (formFields.length) {
    formFields.forEach((formField) => {
      if (!formField.hasAttribute("data-placeholder-nohide")) {
        formField.dataset.placeholder = formField.placeholder;
      }
    });
  }
  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if (
      targetElement.tagName === "INPUT" ||
      targetElement.tagName === "TEXTAREA"
    ) {
      // if (targetElement.dataset.placeholder) {
      // 	targetElement.placeholder = '';
      // }
      // if (!targetElement.hasAttribute('data-no-focus-classes')) {
      // 	targetElement.classList.add('_form-focus');
      // 	targetElement.parentElement.classList.add('_form-focus');
      // }

      formValidate.removeError(targetElement);
    }
  });
  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if (
      formSubmitted &&
      (targetElement.tagName === "INPUT" ||
        targetElement.tagName === "TEXTAREA")
    ) {
      // Моментальная валидация
      if (targetElement.hasAttribute("data-validate")) {
        formValidate.validateInput(targetElement);
      }
    }
  });

  // Если включено, добавляем функционал "Показать пароль"
  if (options.viewPass) {
    document.addEventListener("click", function (e) {
      let targetElement = e.target;
      if (targetElement.closest('[class*="__viewpass"]')) {
        let inputType = targetElement.classList.contains("_viewpass-active")
          ? "password"
          : "text";
        targetElement.parentElement
          .querySelector("input")
          .setAttribute("type", inputType);
        targetElement.classList.toggle("_viewpass-active");
      }
    });
  }
}

export let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll("*[data-required]");

    if (formRequiredItems.length) {
      formRequiredItems.forEach((formRequiredItem) => {
        const isHiddenSection = formRequiredItem.closest(
          '.c-cart__checkout-section[style*="display: none;"]'
        );
        const isHiddenTabsBody = formRequiredItem.closest(
          ".tabs__body[hidden]"
        );

        if (
          (formRequiredItem.offsetParent !== null ||
            formRequiredItem.tagName === "SELECT") &&
          !formRequiredItem.disabled &&
          !isHiddenSection &&
          !isHiddenTabsBody
        ) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    let error = 0;

    if (formRequiredItem.dataset.required === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(" ", "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
      }
    } else if (
      formRequiredItem.type === "checkbox" &&
      !formRequiredItem.checked
    ) {
      this.addError(formRequiredItem);
      error++;
    } else {
      if (!formRequiredItem.value) {
        this.addError(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
      }
    }

    return error;
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add("_form-error");
    formRequiredItem.parentElement.classList.add("_form-error");
    let inputError =
      formRequiredItem.parentElement.querySelector(".form__error");
    if (inputError) formRequiredItem.parentElement.removeChild(inputError);
    if (formRequiredItem.dataset.error) {
      formRequiredItem.parentElement.insertAdjacentHTML(
        "beforeend",
        `<div class="form__error">${formRequiredItem.dataset.error}</div>`
      );
    }
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove("_form-error");
    formRequiredItem.parentElement.classList.remove("_form-error");
    if (formRequiredItem.parentElement.querySelector(".form__error")) {
      formRequiredItem.parentElement.removeChild(
        formRequiredItem.parentElement.querySelector(".form__error")
      );
    }
  },
  formClean(form) {
    form.reset();
    setTimeout(() => {
      let inputs = form.querySelectorAll("input,textarea");
      for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        el.parentElement.classList.remove("_form-focus");
        el.classList.remove("_form-focus");
        formValidate.removeError(el);
      }
      let checkboxes = form.querySelectorAll(".checkbox__input");
      if (checkboxes.length > 0) {
        for (let index = 0; index < checkboxes.length; index++) {
          const checkbox = checkboxes[index];
          checkbox.checked = false;
        }
      }
      if (flsModules.select) {
        let selects = form.querySelectorAll(".select");
        if (selects.length) {
          for (let index = 0; index < selects.length; index++) {
            const select = selects[index].querySelector("select");
            flsModules.select.selectBuild(select);
          }
        }
      }
    }, 0);
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(
      formRequiredItem.value
    );
  },
};

/* Отправка форм */
export function formSubmit(options = { validate: true }) {
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener("submit", function (e) {
        const form = e.target;
        formSubmitAction(form, e);
      });
      form.addEventListener("reset", function (e) {
        const form = e.target;
        formValidate.formClean(form);
      });
    }
  }
  async function formSubmitAction(form, e) {
    const error = !form.hasAttribute("data-no-validate")
      ? formValidate.getErrors(form)
      : 0;
    if (error === 0) {
      const ajax = form.hasAttribute("data-ajax");
      if (ajax) {
        // Если режим ajax
        e.preventDefault();
        const formAction = form.getAttribute("action")
          ? form.getAttribute("action").trim()
          : "#";
        const formMethod = form.getAttribute("method")
          ? form.getAttribute("method").trim()
          : "GET";
        const formData = new FormData(form);

        form.classList.add("_sending");
        const response = await fetch(formAction, {
          method: formMethod,
          body: formData,
        });
        if (response.ok) {
          let responseResult = await response.json();
          form.classList.remove("_sending");
          formSent(form);
        } else {
          alert("Ошибка");
          form.classList.remove("_sending");
        }
      } else if (form.hasAttribute("data-dev")) {
        // Если режим разработки
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
      const formError = form.querySelector("._form-error");
      if (formError && form.hasAttribute("data-goto-error")) {
        gotoBlock(formError, true, 1000);
      }
    }
  }
  // Действия после отправки формы
  function formSent(form) {
    // Создаем событие отправки формы
    document.dispatchEvent(
      new CustomEvent("formSent", {
        detail: {
          form: form,
        },
      })
    );
    // Показываем попап, если подключен модуль попапов
    // и для формы указана настройка
    setTimeout(() => {
      if (flsModules.popup) {
        const popup = form.dataset.popupMessage;
        popup ? flsModules.popup.open(popup) : null;
      }
    }, 0);
    // Очищаем форму
    formValidate.formClean(form);
    // Сообщаем в консоль
    formLogging(`Форма отправлена!`);
  }
  function formLogging(message) {
    FLS(`[Формы]: ${message}`);
  }
}

/* Модуь формы "колличество" */
export function formQuantity() {
  document.addEventListener("click", function (e) {
    let targetElement = e.target;
    if (targetElement.closest(".quantity__button")) {
      let value = parseInt(
        targetElement.closest(".quantity").querySelector("input").value
      );
      if (targetElement.classList.contains("quantity__button_plus")) {
        value++;
      } else {
        --value;
        if (value < 1) value = 1;
      }
      targetElement.closest(".quantity").querySelector("input").value = value;
    }
  });
}




/* Модуь звездного рейтинга */
export function formRating() {
  const ratings = document.querySelectorAll(".rating");
  if (ratings.length > 0) {
    initRatings();
  }
  // Основная функция
  function initRatings() {
    let ratingActive, ratingValue;
    // "Бегаем" по всем рейтингам на странице
    for (let index = 0; index < ratings.length; index++) {
      const rating = ratings[index];
      initRating(rating);
    }
    // Инициализируем конкретный рейтинг
    function initRating(rating) {
      initRatingVars(rating);

      setRatingActiveWidth();

      if (rating.classList.contains("rating_set")) {
        setRating(rating);
      }
    }
    // Инициализайция переменных
    function initRatingVars(rating) {
      ratingActive = rating.querySelector(".rating__active");
      ratingValue = rating.querySelector(".rating__value");
    }
    // Изменяем ширину активных звезд
    function setRatingActiveWidth(index = ratingValue.innerHTML) {
      const ratingActiveWidth = index / 0.05;
      ratingActive.style.width = `${ratingActiveWidth}%`;
    }
    // Возможность указать оценку
    function setRating(rating) {
      const ratingItems = rating.querySelectorAll(".rating__item");
      for (let index = 0; index < ratingItems.length; index++) {
        const ratingItem = ratingItems[index];
        ratingItem.addEventListener("mouseenter", function (e) {
          // Обновление переменных
          initRatingVars(rating);
          // Обновление активных звезд
          setRatingActiveWidth(ratingItem.value);
        });
        ratingItem.addEventListener("mouseleave", function (e) {
          // Обновление активных звезд
          setRatingActiveWidth();
        });
        ratingItem.addEventListener("click", function (e) {
          // Обновление переменных
          initRatingVars(rating);

          if (rating.dataset.ajax) {
            // "Отправить" на сервер
            setRatingValue(ratingItem.value, rating);
          } else {
            // Отобразить указанную оцнку
            ratingValue.innerHTML = index + 1;
            setRatingActiveWidth();
          }
        });
      }
    }
    async function setRatingValue(value, rating) {
      if (!rating.classList.contains("rating_sending")) {
        rating.classList.add("rating_sending");

        // Отправика данных (value) на сервер
        let response = await fetch("rating.json", {
          method: "GET",

          //body: JSON.stringify({
          //	userRating: value
          //}),
          //headers: {
          //	'content-type': 'application/json'
          //}
        });
        if (response.ok) {
          const result = await response.json();

          // Получаем новый рейтинг
          const newRating = result.newRating;

          // Вывод нового среднего результата
          ratingValue.innerHTML = newRating;

          // Обновление активных звезд
          setRatingActiveWidth();

          rating.classList.remove("rating_sending");
        } else {
          alert("Ошибка");

          rating.classList.remove("rating_sending");
        }
      }
    }
  }
}

let myForm = document.getElementById("form");
let formSubmitted = false;

function updateSuccessCartUI() {
  let form = document.getElementById("form");
  if (form) {
    let successCartHTML = `
	  <div class="c-cart__success">
	  <div class="c-cart__success-wrap">
		  <div class="c-cart__success-icon">
			  <svg xmlns="http://www.w3.org/2000/svg" width="50" fill="currentColor" viewBox="0 0 16 16">
				  <path fill-rule="evenodd"
					  d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
				  <path
					  d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
			  </svg>
		  </div>
		  <h2 class="c-cart__success-title">
			  Спасибо за заказ!
		  </h2>
		  <p class="c-cart__success-text">
			  Заказ передан в отдел продаж. В ближайшее время менеджер свяжется с Вами для согласования даты и
			  способа получения заказа.
		  </p>
	  </div>
	  <div class="c-cart__blockWrap">
		  <p class="c-cart__numberText">
			  Номер заказа
		  </p>
		  <p class="c-cart__numberOrder">
			  № 80532
		  </p>
	  </div>
	  <div class="c-cart__blockWrap">
		  <div class="c-cart__success-block">
			  Заказ считается подтверждённым после уточнения деталей с представителем ComTermo по телефону или при
			  получении соответствующего SMS уведомления.
		  </div>
		  <a href="" class="btn__primary">
			  Продолжить покупки
		  </a>
	  </div>
  </div>
        `;

    form.closest(".c-cart__container").innerHTML = successCartHTML;
  }
}

myForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (formSubmitted) {
    console.log("Форма успешно отправлена.");
    updateSuccessCartUI();
    return;
  }

  let errors = formValidate.getErrors(myForm);

  if (errors > 0) {
    Toastify({
      text: "Форма содержит ошибки. Пожалуйста, исправьте их.",
      duration: 3000,
      className: "toast-error",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "#f21827",
      },
    }).showToast();
    console.log("Форма содержит ошибки. Пожалуйста, исправьте их.");
  } else {
    formSubmitted = true;



    console.log("Форма успешно отправлена.");
    updateSuccessCartUI(); 
  }
});
