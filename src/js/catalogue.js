// vin transform
document.querySelectorAll(".vin-input").forEach((input) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
  });
});
// vin transform end

// form validation
(function () {
  "use strict";
  var forms = document.querySelectorAll(".needs-validation");
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false,
    );
  });
})();
// validation end
// form
let currentVin = "";
const vinForms = document.querySelectorAll(".vin-form");

vinForms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      return;
    }

    const formData = new FormData(form);
    currentVin = formData.get("vin");

    const modal = new bootstrap.Modal("#sendVin");
    modal.show();
  });
});

const modalElement = document.getElementById("sendVin");
modalElement.addEventListener("hidden.bs.modal", function () {
  const allForms = document.querySelectorAll(".vin-form");
  allForms.forEach((form) => {
    form.classList.remove("was-validated");
    form.reset();
  });
});
//  form end

// send messages
document.addEventListener("DOMContentLoaded", () => {
  // Делегирование событий - слушаем клики на родителе
  document.addEventListener("click", (e) => {
    if (e.target.closest(".product-card__btn-send")) {
      const modal = new bootstrap.Modal("#sendSms");
      modal.show();
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Делегирование событий - слушаем клики на родителе
  document.addEventListener("click", (e) => {
    if (e.target.closest(".product-card__btn-vin")) {
      const modal = new bootstrap.Modal("#sendVin");
      modal.show();
    }
  });
});

function sendToMessenger(messenger, vin) {
  // Если VIN есть - отправляем сообщение про VIN
  // Если VIN нет (клик по телефону) - отправляем общее сообщение
  let message;

  if (vin) {
    message = `Здравствуйте! Мой VIN-номер: ${vin}. Пожалуйста, подберите контрактный двигатель для моего автомобиля.`;
  } else {
    message = `Здравствуйте! Хочу узнать подробнее о контрактных двигателях`;
  }

  const encodedMessage = encodeURIComponent(message);

  let url = "";

  switch (messenger) {
    case "whatsapp":
      url = `https://wa.me/79175597347?text=${encodedMessage}`;
      break;

    case "telegram":
      url = `https://t.me/dVigateliKotrakt?text=${encodedMessage}`;
      break;

    case "max":
      navigator.clipboard.writeText(message);
      url = `https://max.ru/u/f9LHodD0cOK64KKaIMgoZ2WScD1cDnfsO8qwQjdT0HAEaYNPW2r9pdKkCv8`;
      break;
  }

  window.open(url, "_blank");

  const modal = bootstrap.Modal.getInstance(document.getElementById("sendVin"));
  if (modal) {
    modal.hide();
  }
}

const messengerButtons = document.querySelectorAll(".messenger-btn");
messengerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const messenger = btn.dataset.messenger;
    sendToMessenger(messenger, currentVin);
  });
});

// send messagesend

const statuses = {
  loading: "./icon/status.svg",
  succes: "Заявка на обратный звонок успешно отправленна!",
  error: "Ошибка отравки! Попробуйте позже",
};

const catalogueForms = document.querySelectorAll(".catalogue-form");

catalogueForms.forEach((catalogueForm) => {
  catalogueForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    e.stopPropagation();

    const status = document.createElement("img");
    status.style.cssText = "display: block; margin: auto";
    status.src = statuses.loading;

    if (!this.checkValidity()) {
      this.classList.add("was-validated");
      return;
    }

    this.classList.add("was-validated");

    const BOT_TOKEN = "8504954718:AAHQFIt_EPJ8VkJtcOaiz6X988MTRls0k8Q";
    const CHAT_ID = "-1003339414257";
    const statusModal = new bootstrap.Modal("#status");
    const modal = bootstrap.Modal.getInstance(document.getElementById("sendVin"));
    const statusText = document.querySelector(".status-modal__text");
    const callbackBtn = this.querySelector(".callback__btn");

    callbackBtn.textContent = "";
    callbackBtn.append(status);

    const formData = new FormData(this);

    const vin = formData.get("vin") ? formData.get("vin") : "нет VIN";
    const name = formData.get("username");
    const phone = "+7" + formData.get("phone");

    const message = `
🆕 *Новая заявка Лучшиезапчасти.РФ*
    *страница с каталогом*

📌 *VIN:* ${vin}
👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
  `;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Ошибка отправки в Telegram");
      }

      modal.hide();
      status.remove();
      callbackBtn.textContent = "Отправить заявку";
      statusText.textContent = statuses.succes;
      statusModal.show();
      this.reset();
      this.classList.remove("was-validated");
      setTimeout(function () {
        statusModal.hide();
      }, 3000);
    } catch (error) {
      console.error(error);
      status.remove();
      status.remove();
      callbackBtn.textContent = "Отправить заявку";
      statusText.textContent = statuses.error;
      statusModal.show();
      setTimeout(function () {
        statusModal.hide();
      }, 3000);
    }
  });
});

// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ============================================
let allProducts = []; // Все товары
let filteredProducts = []; // Отфильтрованные товары
let currentPage = 1;
const itemsPerPage = 9; // Количество товаров на странице

// ============================================
// УТИЛИТЫ
// ============================================

// Получение уникальных значений из массива объектов
function getUniqueValues(array, key) {
  return [...new Set(array.map((item) => item[key]))].filter(Boolean).sort();
}

// Получение моделей для конкретной марки
function getModelsByBrand(brand) {
  if (!brand) return [];
  return getUniqueValues(
    allProducts.filter((p) => p.make === brand),
    "model",
  );
}

// Парсинг года из строки формата "11.2009"
function parseYear(yearString) {
  if (!yearString) return null;
  const match = yearString.match(/\d{4}/);
  return match ? parseInt(match[0]) : null;
}

// ============================================
// ЗАПОЛНЕНИЕ ФИЛЬТРОВ
// ============================================

function populateFilters() {
  // Заполняем марки
  const brands = getUniqueValues(allProducts, "make");
  const brandSelect = document.getElementById("brand-filter");
  brandSelect.innerHTML = '<option value="">Все марки</option>';
  brands.forEach((brand) => {
    brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
  });

  // Заполняем типы двигателей
  const engineTypes = getUniqueValues(allProducts, "engine_type").filter(
    (type) => type !== "unknown",
  );
  const engineTypeSelect = document.getElementById("engine-type-filter");
  engineTypeSelect.innerHTML = '<option value="">Все типы</option>';
  engineTypes.forEach((type) => {
    engineTypeSelect.innerHTML += `<option value="${type}">${type}</option>`;
  });
}

// Обновление моделей при выборе марки
function updateModelOptions(selectedBrand) {
  const modelSelect = document.getElementById("model-filter");
  modelSelect.innerHTML = '<option value="">Все модели</option>';

  if (selectedBrand) {
    const models = getModelsByBrand(selectedBrand);
    models.forEach((model) => {
      modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
    });
    modelSelect.disabled = false;
  } else {
    modelSelect.disabled = true;
  }
}

// ============================================
// ФИЛЬТРАЦИЯ
// ============================================

function applyFilters(formData) {
  filteredProducts = allProducts.filter((product) => {
    // Фильтр по марке
    if (formData.brand && product.make !== formData.brand) {
      return false;
    }

    // Фильтр по модели
    if (formData.model && product.model !== formData.model) {
      return false;
    }

    // Фильтр по году
    if (formData.year) {
      const productYear = parseYear(product.year);
      if (productYear !== parseInt(formData.year)) {
        return false;
      }
    }

    // Фильтр по типу двигателя
    if (formData.engineType && product.engine_type !== formData.engineType) {
      return false;
    }

    // Фильтр по цене (от)
    if (formData.priceFrom && product.price < parseInt(formData.priceFrom)) {
      return false;
    }

    // Фильтр по цене (до)
    if (formData.priceTo && product.price > parseInt(formData.priceTo)) {
      return false;
    }

    return true;
  });

  // Сброс на первую страницу при фильтрации
  currentPage = 1;
  updateDisplay();
}

// ============================================
// СОРТИРОВКА
// ============================================

function sortProducts(sortType) {
  switch (sortType) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "year-desc":
      filteredProducts.sort((a, b) => {
        const yearA = parseYear(a.year) || 0;
        const yearB = parseYear(b.year) || 0;
        return yearB - yearA;
      });
      break;
    case "year-asc":
      filteredProducts.sort((a, b) => {
        const yearA = parseYear(a.year) || 0;
        const yearB = parseYear(b.year) || 0;
        return yearA - yearB;
      });
      break;
    default:
      // Возврат к исходному порядку
      applyFilters(getCurrentFormData());
      return;
  }
  updateDisplay();
}

// ============================================
// ПАГИНАЦИЯ
// ============================================

function getPaginatedProducts() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredProducts.slice(startIndex, endIndex);
}

function getTotalPages() {
  return Math.ceil(filteredProducts.length / itemsPerPage);
}

function renderPagination() {
  const totalPages = getTotalPages();
  const paginationContainer = document.querySelector(".pagination");

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = "";

  // Кнопка "Предыдущая"
  paginationHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">Предыдущая</a>
    </li>
  `;

  // Логика отображения страниц
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  // Первая страница
  if (startPage > 1) {
    paginationHTML += `
      <li class="page-item">
        <a class="page-link" href="#" data-page="1">1</a>
      </li>
    `;
    if (startPage > 2) {
      paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  // Страницы
  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  // Последняя страница
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    paginationHTML += `
      <li class="page-item">
        <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
      </li>
    `;
  }

  // Кнопка "Следующая"
  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">Следующая</a>
    </li>
  `;

  paginationContainer.innerHTML = paginationHTML;
}

// ============================================
// РЕНДЕРИНГ
// ============================================

function renderProductCard(product) {
  const {
    product_id,
    title,
    make,
    model,
    year,
    engine_code,
    engine_type,
    price,
    images,
    stock_text,
  } = product;

  const formattedPrice = price ? price.toLocaleString("ru-RU") : "";
  const inStock = stock_text !== "Продано";
  const badgeClass = inStock
    ? "product-card__badge"
    : "product-card__badge product-card__badge--sold";
  const badgeText = inStock ? "В наличии" : "Продано";
  const cardClass = inStock
    ? "product-card"
    : "product-card product-card--sold";
  const buttonDisabled = inStock ? "" : "disabled";
  const displayYear = year || "Не указан";
  const displayEngineType =
    engine_type === "unknown" || !engine_type ? "Не указан" : engine_type;
  const mainImage =
    images && images.length > 0 ? images[0] : "";

  return `
    <div class="col-lg-4 col-md-6 col-sm-12">
      <div class="${cardClass}">
        <div class="product-card__image">
          <img 
            src="${mainImage}" 
            alt="${title} ${make} ${model} ${engine_code}" 
            class="product-card__img"
          >
          <span class="${badgeClass}">${badgeText}</span>
        </div>
        <div class="product-card__body">
          <h5 class="product-card__title">${make} ${model} ${engine_code}</h5>
          <ul class="product-card__specs">
            <li><strong>Марка:</strong> <span>${make}</span></li>
            <li><strong>Модель:</strong> <span>${model}</span></li>
            <li><strong>Год:</strong> <span>${displayYear}</span></li>
            <li><strong>Код двигателя:</strong> <span>${engine_code}</span></li>
            <li><strong>Тип:</strong> <span>${displayEngineType}</span></li>
          </ul>
           <div class="product-card__price">${formattedPrice ? formattedPrice + "₽" : "По запросу"} </div>
        </div>
        <div class="product-card__footer">
            <button class="btn product-card__btn product-card__btn-vin" data-product-id="${product_id}" ${buttonDisabled}>
              Отправить VIN
            </button>
            <button class="btn product-card__btn product-card__btn-send" data-product-id="${product_id}" ${buttonDisabled}>
              Написать в мессенджер
            </button>
          </div>
      </div>
    </div>
  `;
}

function renderProductCard(product) {
  const {
    product_id,
    title,
    make,
    model,
    year,
    engine_code,
    engine_type,
    price,
    images,
    stock_text,
  } = product;

  const formattedPrice = price
    ? price.toLocaleString("ru-RU")
    : "Цена не указана";
  const inStock = stock_text !== "Продано";
  const badgeClass = inStock
    ? "product-card__badge"
    : "product-card__badge product-card__badge--sold";
  const badgeText = inStock ? "В наличии" : "Продано";
  const cardClass = inStock
    ? "product-card"
    : "product-card product-card--sold";
  const buttonDisabled = inStock ? "" : "disabled";
  const displayYear = year || "Не указан";
  const displayEngineType =
    engine_type === "unknown" || !engine_type ? "Не указан" : engine_type;
  const mainImage =
    images && images.length > 0 ? images[0] : "";

  return `
    <div class="col-lg-4 col-md-6 col-sm-12">
      <div class="${cardClass}">
        <div class="product-card__image">
          <!-- Loader -->
          <div class="product-card__loader" data-product="${product_id}">
            <img src="./icon/status.svg" alt="Загрузка...">
          </div>
          
          <!-- Картинка скрыта -->
          <img 
            src="${mainImage}" 
            alt="${title} ${make} ${model} ${engine_code}" 
            class="product-card__img"
            data-product="${product_id}"
            style="display: none;"
          >
          <span class="${badgeClass}">${badgeText}</span>
        </div>
        <div class="product-card__body">
          <h5 class="product-card__title">${make} ${model} ${engine_code}</h5>
          <ul class="product-card__specs">
            <li><strong>Марка:</strong> <span>${make}</span></li>
            <li><strong>Модель:</strong> <span>${model}</span></li>
            <li><strong>Год:</strong> <span>${displayYear}</span></li>
            <li><strong>Код двигателя:</strong> <span>${engine_code}</span></li>
            <li><strong>Тип:</strong> <span>${displayEngineType}</span></li>
          </ul>
           <div class="product-card__price">${formattedPrice} ₽</div>
        </div>
        <div class="product-card__footer">
            <button class="btn product-card__btn product-card__btn-vin" data-product-id="${product_id}" ${buttonDisabled}>
              Отправить VIN
            </button>
            <button class="btn product-card__btn product-card__btn-send" data-product-id="${product_id}" ${buttonDisabled}>
              Написать в мессенджер
            </button>
          </div>
      </div>
    </div>
  `;
}

// Функция обработки загрузки
function handleImageLoading() {
  const images = document.querySelectorAll(".product-card__img");

  images.forEach((img) => {
    const productId = img.dataset.product;
    const loader = document.querySelector(
      `.product-card__loader[data-product="${productId}"]`,
    );

    // Картинка загрузилась - скрываем loader, показываем картинку
    img.addEventListener("load", function () {
      this.style.display = "block";
      if (loader) loader.style.display = "none";
    });

    // Ошибка загрузки - показываем placeholder
    img.addEventListener("error", function () {
      this.src = "";
      if (loader) loader.style.display = "none";
    });
  });
}

// В функции updateDisplay добавь вызов
function updateDisplay() {
  document.querySelector(".catalogue__results strong").textContent =
    filteredProducts.length;

  const productsGrid = document.getElementById("products-grid");
  const paginatedProducts = getPaginatedProducts();

  if (paginatedProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          <h4>Ничего не найдено</h4>
          <p>Попробуйте изменить параметры фильтрации</p>
        </div>
      </div>
    `;
  } else {
    productsGrid.innerHTML = paginatedProducts
      .map((product) => renderProductCard(product))
      .join("");

    // Вызываем обработку загрузки
    handleImageLoading();
  }

  renderPagination();

  document.querySelector(".catalogue__content").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================

function getCurrentFormData() {
  return {
    brand: document.getElementById("brand-filter").value,
    model: document.getElementById("model-filter").value,
    year: document.getElementById("year-filter").value,
    engineType: document.getElementById("engine-type-filter").value,
    priceFrom: document.getElementById("price-from").value,
    priceTo: document.getElementById("price-to").value,
  };
}

function setupEventListeners() {
  // Изменение марки
  document.getElementById("brand-filter").addEventListener("change", (e) => {
    updateModelOptions(e.target.value);
    // Сброс модели при смене марки
    document.getElementById("model-filter").value = "";
  });

  // Применение фильтров
  document.getElementById("filters-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = getCurrentFormData();
    applyFilters(formData);
  });

  // Сброс фильтров
  document.getElementById("filters-form").addEventListener("reset", () => {
    setTimeout(() => {
      document.getElementById("model-filter").disabled = true;
      filteredProducts = [...allProducts];
      currentPage = 1;
      updateDisplay();
    }, 0);
  });

  // Сортировка
  document.getElementById("sort-select").addEventListener("change", (e) => {
    sortProducts(e.target.value);
  });

  // Пагинация (делегирование событий)
  document.querySelector(".pagination").addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.tagName === "A" && !e.target.closest(".disabled")) {
      const page = parseInt(e.target.dataset.page);
      if (page && page !== currentPage && page > 0 && page <= getTotalPages()) {
        currentPage = page;
        updateDisplay();
      }
    }
  });
}

// Функция для рандомной перемешки массива (Fisher-Yates shuffle)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // Загрузка данных (предполагается, что enginesData доступна глобально)
  allProducts = shuffleArray(enginesData || []);
  filteredProducts = [...allProducts];

  // Заполнение фильтров
  populateFilters();

  // Первоначальный рендеринг
  updateDisplay();

  // Настройка обработчиков
  setupEventListeners();
});
