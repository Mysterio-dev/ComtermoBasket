// Импорт модулей и функций
import { updateEmptyCart } from "./updateEmptyCart.js";
import { declineProduct } from "./declineProduct.js";
import { CountUp } from "countup.js";
import Toastify from "toastify-js";

// Инициализация переменных для хранения общего количества товаров и общей цены
let totalQuantity = 0;
let totalPrice = 0;
let generalPrice = 0;
let totalDeliveryCost = 0;
let currentDeliveryCost = 0;

// Получение всех элементов товаров на странице
let productItems = document.querySelectorAll(".c-cart__order-item");

// Получение элементов для отображения общего количества и цены
const totalQuantityElement = document.querySelector(".c-cart__top-number");
const cartInfoLeftNumber = document.querySelector(".cart__infoLeft-number");
const cartInfoPrice = document.querySelector(".c-cart__infoPrice");
const totalPriceElement = document.querySelector(".c-cart__totalPrice");

// Экземпляр CountUp для totalPriceElement
const totalPriceCountUp = new CountUp(totalPriceElement, 0, {
  useEasing: true,
  useGrouping: true,
  separator: " ",
  duration: 0.5,
  options: {
    easingFn: (t, b, c, d) => (c * t) / d + b,
  },
});

// Экземпляр CountUp для cartInfoPrice
const cartInfoPriceCountUp = new CountUp(cartInfoPrice, 0, {
  useEasing: true,
  useGrouping: true,
  separator: " ",
  duration: 0.5,
  options: {
    easingFn: (t, b, c, d) => (c * t) / d + b,
  },
});

// Функция для обновления общего количества товаров
function updateCounters() {
  totalQuantityElement.textContent = `${totalQuantity} ${declineProduct(
    totalQuantity
  )}`;
  cartInfoLeftNumber.textContent = `(${totalQuantity})`;
}

// Функция для обновления общей цены товаров в корзине
function updateTotalPrice() {
  totalPrice = 0;
  productItems.forEach(function (productItem) {
    const quantityInput = productItem.querySelector(".quantity__input input");
    const pricePerUnit = parseInt(
      productItem
        .querySelector(".c-cart__firstPrice")
        .textContent.replace(/\s+/g, "")
    );
    const quantity = parseInt(quantityInput.value);
    const totalPriceForItem = pricePerUnit * quantity;
    totalPrice += totalPriceForItem;
  });

  generalPrice = totalPrice;

  totalPriceCountUp.update(generalPrice);
}

// Функция для обновления цены за все товары
function updateItemPrices() {
  let totalPrice = 0;
  productItems.forEach(function (productItem) {
    const quantityInput = productItem.querySelector(".quantity__input input");
    const pricePerUnit = parseInt(
      productItem
        .querySelector(".c-cart__firstPrice")
        .textContent.replace(/\s+/g, "")
    );
    const quantity = parseInt(quantityInput.value);
    const totalPriceForItem = pricePerUnit * quantity;
    totalPrice += totalPriceForItem;
  });

  cartInfoPriceCountUp.update(totalPrice);

  updatePriceDelivery();
}

// Для каждого продукта
productItems.forEach(function (productItem) {
  // Получаем элементы
  const quantityInput = productItem.querySelector(".quantity__input input");
  const initialPrice = parseInt(
    productItem.querySelector(".c-cart__price").textContent.replace(/\s+/g, "")
  );
  const priceElement = productItem.querySelector(".c-cart__price");
  const plusButton = productItem.querySelector(".quantity__button_plus");
  const minusButton = productItem.querySelector(".quantity__button_minus");
  const cCartFirstPrice = productItem.querySelector(".c-cart__firstPrice");
  const initialPriceText = `${initialPrice.toLocaleString()} руб. / шт.`;
  const initialPriceTextElement = document.createElement("div");
  initialPriceTextElement.classList.add("c-cart__initial-price");
  initialPriceTextElement.textContent = initialPriceText;

  // CountUp для анимации изменения цены
  const countUp = new CountUp(priceElement, initialPrice, {
    useEasing: true,
    useGrouping: true,
    separator: " ",
    duration: 0.5,
    options: {
      easingFn: (t, b, c, d) => (c * t) / d + b,
    },
  });

  const updatePrice = (updateTotalQuantity = true) => {
    const quantity = parseInt(quantityInput.value);
    const totalPrice = initialPrice * quantity;

    if (countUp.error || countUp.endVal !== totalPrice) {
      countUp.update(totalPrice);
    } else {
      priceElement.textContent = totalPrice.toLocaleString();
    }

    updateButtonState(quantity);

    // Показываем/скрываем текст с начальной ценой в зависимости от количества
    initialPriceTextElement.style.display = quantity === 1 ? "none" : "block";

    // Обновляем общее количество товаров только если updateTotalQuantity равно true
    if (updateTotalQuantity) {
      // Обновляем totalQuantity на основе текущего количества товара
      totalQuantity = Array.from(productItems).reduce(
        (acc, item) =>
          acc + parseInt(item.querySelector(".quantity__input input").value),
        0
      );

      // Обновляем текст с общим количеством товаров
      updateCounters();
    }
  };

  // Обработчик события ввода количества товара
  quantityInput.addEventListener("input", function () {
    let quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 1) {
      quantityInput.value = 1;
      quantity = 1;
    } else if (quantity > 9999) {
      quantity = 9999;
      quantityInput.value = quantity;
    }

    // Счетчик количества товаров
    updatePrice();

    // Обновление цены за все товары
    updateItemPrices();

    // Обновление общей цены
    updateTotalPrice();
  });

  // Функция для обновления состояния кнопок увеличения/уменьшения количества товара
  function updateButtonState(quantity) {
    if (quantity === 1) {
      minusButton.classList.add("disabled");
    } else {
      minusButton.classList.remove("disabled");
    }

    if (quantity === 9999) {
      plusButton.classList.add("disabled");
    } else {
      plusButton.classList.remove("disabled");
    }
  }

  // Обработчик события клика на кнопку увеличения количества товара
  plusButton.addEventListener("click", function () {
    let quantity = parseInt(quantityInput.value) + 1;
    if (quantity > 9999) {
      quantity = 9999;
    }

    // Получаем старое количество товара
    const oldQuantity = parseInt(quantityInput.value);

    // Обновляем значение в поле ввода количества
    quantityInput.value = quantity;

    // Получаем стоимость одной единицы товара
    const pricePerUnit = parseInt(
      productItem
        .querySelector(".c-cart__firstPrice")
        .textContent.replace(/\s+/g, "")
    );

    // Вычисляем разницу между новым и старым количеством товара
    const quantityDifference = quantity - oldQuantity;

    // Вычисляем стоимость добавленных товаров
    const addedPrice = quantityDifference * pricePerUnit;

    // Обновляем общую цену
    generalPrice += addedPrice;

    // Обновляем общую сумму с анимацией
    totalPriceCountUp.update(generalPrice);

    // Обновляем текст с общим количеством товаров
    totalQuantity += quantityDifference;
    updateCounters();

    // Обновляем цену за товар в соответствующем элементе
    const totalPriceForItem = pricePerUnit * quantity;

    countUp.update(totalPriceForItem);

    // Обновляем стиль c-cart__firstPrice в зависимости от количества товара
    if (quantity === 1) {
      initialPriceTextElement.style.display = "none";
    } else {
      initialPriceTextElement.style.display = "block";
    }

    // Обновляем состояние кнопок увеличения/уменьшения количества товара
    updateButtonState(quantity);

    updateItemPrices();
  });

  // Обработчик события клика на кнопку уменьшения количества товара
  minusButton.addEventListener("click", function () {
    let quantity = parseInt(quantityInput.value) - 1;
    if (quantity < 1) {
      quantity = 1;
    }

    // Получаем старое количество товара
    const oldQuantity = parseInt(quantityInput.value);

    // Обновляем значение в поле ввода количества
    quantityInput.value = quantity;

    // Получаем стоимость одной единицы товара
    const pricePerUnit = parseInt(
      productItem
        .querySelector(".c-cart__firstPrice")
        .textContent.replace(/\s+/g, "")
    );

    // Вычисляем разницу между новым и старым количеством товара
    const quantityDifference = oldQuantity - quantity;

    // Вычисляем стоимость уменьшенных товаров
    const removedPrice = quantityDifference * pricePerUnit;

    // Обновляем общую цену
    generalPrice -= removedPrice;

    // Обновляем общую сумму с анимацией
    totalPriceCountUp.update(generalPrice);

    // Обновляем текст с общим количеством товаров
    totalQuantity -= quantityDifference;
    updateCounters();

    // Обновляем цену за товар в соответствующем элементе
    const totalPriceForItem = pricePerUnit * quantity;
    priceElement.textContent = totalPriceForItem.toLocaleString();
    countUp.update(totalPriceForItem);

    // Обновляем стиль c-cart__firstPrice в зависимости от количества товара
    if (quantity === 1) {
      initialPriceTextElement.style.display = "none";
    } else {
      initialPriceTextElement.style.display = "block";
    }

    // Обновляем состояние кнопок увеличения/уменьшения количества товара
    updateButtonState(quantity);
    updateItemPrices();
  });

  // Добавляем текст с начальной ценой к элементу товара
  cCartFirstPrice.appendChild(initialPriceTextElement);

  updatePrice();
});

// Обновляем общую цену
updateTotalPrice();

// Обновляем цену всех товаров
updateItemPrices();

// Функция обработки клика по кнопке удаления товара
function handleDeleteButtonClick(event) {
  const button = event.target;
  const productItem = button.closest(".c-cart__order-item");
  const quantityInput = productItem.querySelector(".quantity__input input");
  const quantity = parseInt(quantityInput.value);

  // Уменьшаем общее количество товаров на количество удаляемых единиц
  totalQuantity -= quantity;
  updateCounters(); // Обновляем текст с общим количеством товаров

  // Получаем цену за единицу товара и количество единиц товара для вычета из общей суммы
  const pricePerUnit = parseInt(
    productItem
      .querySelector(".c-cart__firstPrice")
      .textContent.replace(/\s+/g, "")
  );
  const totalPriceForItem = pricePerUnit * quantity;

  // Удаляем товар из списка продуктов
  productItem.remove();

  // Вычитаем стоимость удаленных товаров из общей цены
  generalPrice -= totalPriceForItem;

  // Обновляем общую сумму с анимацией
  totalPriceCountUp.update(generalPrice);

  // Обновляем коллекцию productItems, чтобы она отражала текущее состояние DOM
  productItems = document.querySelectorAll(".c-cart__order-item");

  updateItemPrices();

  // Если список продуктов стал пустым, вызываем функцию для обновления пустой корзины
  if (document.querySelectorAll(".c-cart__order-item").length === 0) {
    updateEmptyCart();
  }

  // Показываем уведомление Toastify
  Toastify({
    text: `Товар удалён из корзины`,
    duration: 3000, // Время отображения уведомления в миллисекундах
    className: "toast-error",
    position: "center", // Позиция уведомления
    style: {
      background: "#f21827",
    },
  }).showToast();
}

// Функция для обновления общей цены корзины с учетом стоимости доставки МКАД
function updatePriceDelivery() {
  // Добавляем к ней стоимость доставки
  let totalPrice = generalPrice + totalDeliveryCost;

  // Обновляем общую цену корзины в totalPriceElement
  totalPriceElement.textContent = totalPrice.toLocaleString();
  totalPriceCountUp.update(totalPrice);
}

// Функция для инициализации информации о доставке при загрузке страницы
function initializeDeliveryInfo() {
  // Проверяем какая доставка уже выбрана
  const selectedDeliveryOption = document.querySelector(
    ".cardSelect__input:checked"
  );
  if (selectedDeliveryOption) {
    // Получаем значение data-show у выбранной доставки
    const selectedValue = selectedDeliveryOption.getAttribute("data-show");
    if (selectedValue) {
      // Обновляем информацию о доставке
      updateDeliveryInfo(selectedValue);
    }
  }
}

// Функция для расчета стоимости доставки в зависимости от введенного расстояния
function distanceCalculation(inputClass, deliveryInfoClass) {
  let distanceInputs = document.querySelectorAll(inputClass);
  let deliveryInfoBlocks = document.querySelectorAll(deliveryInfoClass);

  if (!distanceInputs.length || !deliveryInfoBlocks.length) return;

  distanceInputs.forEach(function (distanceInput) {
    distanceInput.addEventListener("input", function () {
      let enteredDistance = distanceInput.value.trim();

      if (enteredDistance === "") {
        // Если расстояние не указано, показать сообщение об ошибке
        deliveryInfoBlocks.forEach(function (deliveryInfoBlock) {
          deliveryInfoBlock.textContent = "" + "0 руб.";

          Toastify({
            text: "Введенное расстояние не может быть пустым. Пожалуйста, введите корректное значение.",
            duration: 3000,
            className: "toast-error",
            position: "center",
            stopOnFocus: true,
            style: {
              background: "#f21827",
            },
          }).showToast();
        });
      } else {
        enteredDistance = parseFloat(enteredDistance);

        if (
          !isNaN(enteredDistance) &&
          enteredDistance > 0 &&
          enteredDistance <= 100
        ) {
          // Если введено корректное расстояние, рассчитать стоимость доставки
          let calculatedPrice = enteredDistance * 40; // Расчет цены
          deliveryInfoBlocks.forEach(function (deliveryInfoBlock) {
            deliveryInfoBlock.textContent = calculatedPrice + " руб.";
          });

          // Обновляем общую стоимость доставки
          totalDeliveryCost = calculatedPrice;

          // Обновляем общую цену корзины, учитывая стоимость доставки
          updatePriceDelivery();
        } else {
          // Если расстояние превышает максимальное значение, показать сообщение об ошибке
          deliveryInfoBlocks.forEach(function (deliveryInfoBlock) {
            deliveryInfoBlock.textContent = "" + "0 руб.";

            Toastify({
              text: "Превышено максимальное расстояние (не больше 100 км). Пожалуйста, исправьте их",
              duration: 3000,
              className: "toast-error",
              position: "center",
              stopOnFocus: true,
              style: {
                background: "#f21827",
              },
            }).showToast();
          });

          // Если расстояние превышает максимальное значение, очищаем поле ввода
          distanceInput.value = "";

          // Обновляем общую цену корзины, вычитая предыдущую стоимость доставки
          totalDeliveryCost = 0;
          updatePriceDelivery();
        }
      }
    });
  });
}

// Функция для обновления информации о доставке
function updateDeliveryInfo(selectedValue) {
  const deliveryMethodElement = document.getElementById("deliveryMethod");
  const deliveryInfoElement = document.getElementById("deliveryInfo");

  const selectedDeliveryOption = document.querySelector(
    `[data-show="${selectedValue}"]`
  );
  if (!selectedDeliveryOption) return;

  // Получаем метод доставки и стоимость доставки
  const deliveryMethod =
    selectedDeliveryOption.parentElement.querySelector(
      ".delivery-method"
    ).value;
  const newDeliveryCost = parseInt(
    selectedDeliveryOption.parentElement.querySelector(".delivery-cost").value
  );

  if (deliveryMethodElement) {
    deliveryMethodElement.textContent = deliveryMethod;
  }
  if (deliveryInfoElement) {
    deliveryInfoElement.textContent = newDeliveryCost + " руб.";
  }

  if (deliveryInfoElement) {
    // Проверяем, является ли выбранный метод доставки "Самовывоз"
    if (deliveryMethod === "Пункт выдачи Comtermo") {
      // Если да, отображаем "Бесплатно"
      deliveryInfoElement.textContent = "Бесплатно";
    } else {
      // Иначе отображаем стоимость доставки
      deliveryInfoElement.textContent = newDeliveryCost + " руб.";
    }
  }
  // Сначала отнимаем стоимость предыдущей доставки
  generalPrice -= currentDeliveryCost;

  // Затем добавляем стоимость новой доставки
  generalPrice += newDeliveryCost;

  // Обновляем общую цену корзины в totalPriceElement, учитывая стоимость доставки
  totalPriceElement.textContent = generalPrice.toLocaleString();
  totalPriceCountUp.update(generalPrice);

  // Обновляем текущую стоимость доставки
  currentDeliveryCost = newDeliveryCost;
}

function removeActiveClass(container) {
  container.querySelectorAll(".cardSelect").forEach(function (cardSelect) {
    cardSelect.classList.remove("_active");
  });
}

// Функция для обработки выбора варианта доставки
function handleInputSelection(container, input) {
  removeActiveClass(container);

  if (input.checked) {
    input.closest(".cardSelect").classList.add("_active");
    const selectedValue = input.getAttribute("data-show");
    if (selectedValue) {
      updateDeliveryInfo(selectedValue);
    }
  }

  hideAllSections();
  showSelectedBlocks();
}

// Функция для отображения выбранных блоков
function showSelectedBlocksForGroup(group) {
  let checkedInput = document.querySelector(
    `.c-cart__gridSelect[data-group="${group}"] .cardSelect__input:checked`
  );
  if (checkedInput) {
    let dataShowAttribute = checkedInput.getAttribute("data-show");
    if (dataShowAttribute) {
      let blocksToShow = dataShowAttribute.split(" ");
      blocksToShow.forEach((blockName) => {
        document
          .querySelectorAll(`[data-block="${blockName}"]`)
          .forEach((section) => {
            section.style.display = "block";
          });
      });
    }
  }
}

// Функция для обработки выбора метода доставки
function handleDeliverySelection(group) {
  let container = document.querySelector(
    `.c-cart__gridSelect[data-group="${group}"]`
  );
  if (!container) return;

  let radioButtons = container.querySelectorAll(".cardSelect__input");
  radioButtons.forEach(function (radioButton) {
    radioButton.addEventListener("change", function () {
      handleInputSelection(container, radioButton);
    });
  });

  showSelectedBlocks();
}

// Функция для добавления обработчиков событий выбора метода доставки
function addDeliveryOptionsHandler(group) {
  let container = document.querySelector(
    `.c-cart__gridSelect[data-group="${group}"]`
  );
  if (!container) return;

  let inputs = container.querySelectorAll(".cardSelect__input");
  inputs.forEach(function (input) {
    input.addEventListener("change", function () {
      handleInputSelection(container, input);
    });
  });

  showSelectedBlocks();
}

// Функция для отображения выбранных блоков для группы
function showSelectedBlocks() {
  showSelectedBlocksForGroup("deliveryOptions");
  showSelectedBlocksForGroup("deliveryOptionsTwo");
}

// Функция для скрытия всех разделов на странице
function hideAllSections() {
  document
    .querySelectorAll(".c-cart__checkout-section")
    .forEach(function (section) {
      section.style.display = "none";
    });
}

// Функция для управления выбором способа оплаты
function managePaymentSelection() {
  let container = document.querySelector(
    '.c-cart__gridSelect[data-group="paymentOptions"]'
  );
  if (!container) return;

  let inputs = container.querySelectorAll(".cardSelect__input");
  inputs.forEach(function (input) {
    input.addEventListener("change", function () {
      removeActiveClass(container);
      if (input.checked) {
        input.closest(".cardSelect").classList.add("_active");
      }
    });
  });
}

let deleteButtons = document.querySelectorAll(".c-cart__delete");
deleteButtons.forEach(function (button) {
  button.addEventListener("click", handleDeleteButtonClick);
});

let confirmClearCartButton = document.getElementById("confirmClearCartButton");
if (confirmClearCartButton) {
  confirmClearCartButton.addEventListener("click", clearCart);
}

// Очистка корзины
function clearCart() {
  updateEmptyCart();
}

// Инициализация обработчиков выбора метода доставки
handleDeliverySelection("deliveryOptions");
handleDeliverySelection("deliveryOptionsTwo");
addDeliveryOptionsHandler("deliveryOptions");
addDeliveryOptionsHandler("deliveryOptionsTwo");
managePaymentSelection();

// Вызываем функцию инициализации при загрузке страницы
document.addEventListener("DOMContentLoaded", initializeDeliveryInfo);

// Инициализация функции для расчета стоимости доставки при вводе расстояния от МКАД
distanceCalculation(".mkad", ".c-cart__infoPrice.deliveryInfo");
