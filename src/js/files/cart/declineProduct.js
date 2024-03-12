  // Функция для склонения слова "товар" в зависимости от числа
  function declineProduct(count) {
    const lastTwoDigits = count % 100;
    const lastDigit = count % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 20) {
      return "товаров";
    }
    if (lastDigit === 1) {
      return "товар";
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return "товара";
    }
    return "товаров";
  }

  export { declineProduct };