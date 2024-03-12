// Функция для скрытия элементов формы по их идентификаторам
function hideFormControlsAndByIds(ids) {
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      const formControl = element.closest(".form__col-grid");
      if (formControl) {
        formControl.style.display = "none";
      }
    }
  });
}
// Функция для отображения элементов формы по их идентификаторам
function showFormControlsAndByIds(ids) {
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      const formControl = element.closest(".form__col-grid");
      if (formControl) {
        formControl.style.display = "block";
      }
    }
  });
}
// Функция для обработки изменения файла
function handleFileChange() {
  const fileInput = document.getElementById("fileInput");
  const fileListDiv = document.getElementById("fileList");
  const formControlIdsToHide = [
    "inn",
    "kpp",
    "bik",
    "rs",
    "korshet",
    "bank_name",
    "urid_adres",
    "fact_adres",
  ];

  if (fileInput.files.length > 0) {
    hideFormControlsAndByIds([...formControlIdsToHide]);
    const file = fileInput.files[0];
    const fileNameElement = document.createElement("p");
    fileNameElement.textContent = file.name;
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">' +
      '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>' +
      "</svg>";
    // Обработчик события для удаления файла
    deleteButton.onclick = function () {
      showFormControlsAndByIds([...formControlIdsToHide]);
      fileListDiv.removeChild(fileNameElement);
      fileListDiv.removeChild(deleteButton);
      fileInput.value = "";
    };
    // Очистить список файлов и добавить имя файла и кнопку удаления
    fileListDiv.innerHTML = "";
    fileListDiv.appendChild(fileNameElement);
    fileListDiv.appendChild(deleteButton);
  } else {
    showFormControlsAndByIds([...formControlIdsToHide]);
  }
}
// Добавить обработчик события изменения файла
document
  .getElementById("fileInput")
  .addEventListener("change", handleFileChange);
