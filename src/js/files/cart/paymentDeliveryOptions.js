
// // Функция для обновления информации о доставке в зависимости от выбранного значения
// function updateDeliveryInfo(selectedValue) {
//   let deliveryMethodBlock = document.querySelector(".deliveryMethod");
//   let deliveryInfoBlock = document.querySelector(".deliveryInfo");

//   // Объект с общими значениями для различных методов доставки
 
//   const commonValues = {
//     moscowDelivery: { method: "Доставка по Москве", cost: 500 },
//     pickupDelivery: { method: "Пункт выдачи Comtermo", cost: 0 },
//     transportDelivery: { method: "Доставка ТК", cost: 500 },
//     areaDelivery: { method: "Доставка в область", cost: 0 },
//   };
  
//   // Объединение общих значений с дополнительными значениями
//   const deliveryOptions = {
//     ...commonValues,
//     ...Object.fromEntries(
//       Object.entries(commonValues).map(([key, value]) => [`${key}Two`, value])
//     ),
//   };

//   // Обновление информации о доставке на странице
//   if (deliveryOptions[selectedValue]) {
//     deliveryMethodBlock.textContent = deliveryOptions[selectedValue].method;
//     deliveryInfoBlock.textContent = deliveryOptions[selectedValue].cost;
//   }
// }

// document.addEventListener("DOMContentLoaded", function () {
//   function removeActiveClass(container) {
//     container.querySelectorAll(".cardSelect").forEach(function (cardSelect) {
//       cardSelect.classList.remove("_active");
//     });
//   }

//   // Функция для обработки выбора варианта доставки
//   function handleInputSelection(container, input) {
//     removeActiveClass(container);

//     if (input.checked) {
//       input.closest(".cardSelect").classList.add("_active");
//       const selectedValue = input.getAttribute("data-show");
//       if (selectedValue) {
//         updateDeliveryInfo(selectedValue);
//       }
//     }

//     hideAllSections();
//     showSelectedBlocks();
//   }

//   // Функция для обработки выбора метода доставки
//   function handleDeliverySelection(group) {
//     let container = document.querySelector(
//       `.c-cart__gridSelect[data-group="${group}"]`
//     );
//     if (!container) return;

//     let radioButtons = container.querySelectorAll(".cardSelect__input");
//     radioButtons.forEach(function (radioButton) {
//       radioButton.addEventListener("change", function () {
//         handleInputSelection(container, radioButton);
//       });
//     });

//     showSelectedBlocks();
//   }

//   // Функция для добавления обработчиков событий выбора метода доставки
//   function addDeliveryOptionsHandler(group) {
//     let container = document.querySelector(
//       `.c-cart__gridSelect[data-group="${group}"]`
//     );
//     if (!container) return;

//     let inputs = container.querySelectorAll(".cardSelect__input");
//     inputs.forEach(function (input) {
//       input.addEventListener("change", function () {
//         handleInputSelection(container, input);
//       });
//     });

//     showSelectedBlocks();
//   }

//   // Функция для скрытия всех разделов на странице
//   function hideAllSections() {
//     document
//       .querySelectorAll(".c-cart__checkout-section")
//       .forEach(function (section) {
//         section.style.display = "none";
//       });
//   }

//   // Функция для отображения выбранных блоков
//   function showSelectedBlocksForGroup(group) {
//     let checkedInput = document.querySelector(
//       `.c-cart__gridSelect[data-group="${group}"] .cardSelect__input:checked`
//     );
//     if (checkedInput) {
//       let dataShowAttribute = checkedInput.getAttribute("data-show");
//       if (dataShowAttribute) {
//         let blocksToShow = dataShowAttribute.split(" ");
//         blocksToShow.forEach((blockName) => {
//           document
//             .querySelectorAll(`[data-block="${blockName}"]`)
//             .forEach((section) => {
//               section.style.display = "block";
//             });
//         });
//       }
//     }
//   }

//   // Функция для отображения выбранных блоков для группы
//   function showSelectedBlocks() {
//     showSelectedBlocksForGroup("deliveryOptions");
//     showSelectedBlocksForGroup("deliveryOptionsTwo");
//   }

//   // Функция для управления выбором способа оплаты
//   function managePaymentSelection() {
//     let container = document.querySelector(
//       '.c-cart__gridSelect[data-group="paymentOptions"]'
//     );
//     if (!container) return;

//     let inputs = container.querySelectorAll(".cardSelect__input");
//     inputs.forEach(function (input) {
//       input.addEventListener("change", function () {
//         removeActiveClass(container);
//         if (input.checked) {
//           input.closest(".cardSelect").classList.add("_active");
//         }
//       });
//     });
//   }
  
//   // Инициализация обработчиков выбора метода доставки
//   handleDeliverySelection("deliveryOptions");
//   handleDeliverySelection("deliveryOptionsTwo");
//   addDeliveryOptionsHandler("deliveryOptions");
//   addDeliveryOptionsHandler("deliveryOptionsTwo");
//   managePaymentSelection();
// });


