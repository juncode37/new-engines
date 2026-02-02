let isInitialLoad = true;

const PHONE_NUMBER = "+79127778234";
const PHONE_DISPLAY = "+7 (912) 777 82 34";

document.addEventListener("DOMContentLoaded", function () {
  const phoneLinks = document.querySelectorAll(".ph-n");

  phoneLinks.forEach((link) => {
    link.href = `tel:${PHONE_NUMBER}`;

    if (!link.querySelector("*")) {
      link.textContent = PHONE_DISPLAY;
    }
  });
});

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
if (modalElement) {
  modalElement.addEventListener("hidden.bs.modal", function () {
    const allForms = document.querySelectorAll(".vin-form");
    allForms.forEach((form) => {
      form.classList.remove("was-validated");
      form.reset();
    });
  });
}
//  form end

// send messages
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".product-card__btn-send")) {
      const modal = new bootstrap.Modal("#sendSms");
      modal.show();
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest(".product-card__btn-vin")) {
      const modal = new bootstrap.Modal("#sendVin");
      modal.show();
    }
  });
});

function sendToMessenger(messenger, vin) {
  if (messenger === "tel") {
    window.location.href = `tel:${PHONE_NUMBER}`;
    return;
  }
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
  loading: "./icon/status-white.svg",
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
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("sendVin"),
    );
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

      if (modal) modal.hide();
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
      callbackBtn.textContent = "Отправить заявку";
      statusText.textContent = statuses.error;
      statusModal.show();
      setTimeout(function () {
        statusModal.hide();
      }, 3000);
    }
  });
});

// Call trigger button
const callTrigger = document.querySelector(".call-trigger");

if (callTrigger) {
  callTrigger.addEventListener("click", () => {
    const modal = new bootstrap.Modal("#sendSms");
    modal.show();
  });
}
function CallTriggerMove() {
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > window.innerHeight / 5) {
      callTrigger.classList.remove("call-trigger-center");
      callTrigger.classList.add("call-trigger-bottom");
    } else {
      callTrigger.classList.remove("call-trigger-bottom");
      callTrigger.classList.add("call-trigger-center");
    }
  });
}

function callTriggerPosition() {
  if (window.innerWidth < 700) {
    callTrigger.classList.remove("call-trigger-bottom");
    callTrigger.classList.add("call-trigger-center");
    CallTriggerMove();
  } else {
    callTrigger.classList.remove("call-trigger-center");
    callTrigger.classList.add("call-trigger-bottom");
  }
}

callTriggerPosition();

// Call trigger end

// Конфигурация API
const API_BASE_URL = "https://api.xn--80aanidep0btkd2cfi.xn--p1ai/engines/";
const itemsPerPage = 9; // Количество карточек на странице

let currentPage = 1;
let currentFilters = {};
let totalItems = 0;
let hasMorePages = true;
let isLoading = false;

// Функция для построения URL с параметрами
function buildApiUrl(filters, page) {
  const params = new URLSearchParams();

  // Пагинация
  params.append("limit", itemsPerPage);
  params.append("offset", (page - 1) * itemsPerPage);

  // Фильтры
  if (filters.brand) params.append("make", filters.brand);
  if (filters.model) params.append("model", filters.model);
  if (filters.year) params.append("year", filters.year);
  if (filters.engineType) params.append("engine_type", filters.engineType);
  if (filters.priceFrom) params.append("price_min", filters.priceFrom);
  if (filters.priceTo) params.append("price_max", filters.priceTo);

  return `${API_BASE_URL}?${params.toString()}`;
}

// Загрузка данных с API
async function fetchEngines(filters, page) {
  if (isLoading) return null;

  isLoading = true;

  try {
    const url = buildApiUrl(filters, page);
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // API возвращает массив напрямую
    if (Array.isArray(data)) {
      return {
        products: data,
        hasMore: data.length === itemsPerPage, // Если вернулось 9, значит есть ещё
      };
    }

    // Если API возвращает объект с данными
    const products = data.data || data.results || data;
    return {
      products: products,
      hasMore: products.length === itemsPerPage,
      total: data.total || data.count || null,
    };
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    showErrorMessage("Ошибка загрузки данных. Попробуйте позже.");
    return null;
  } finally {
    isLoading = false;
    hideLoadingIndicator();
  }
}

// Загрузка уникальных значений для фильтров
async function fetchFilterOptions() {
  try {
    const response = await fetch(`${API_BASE_URL}?limit=200&offset=0`, {
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const products = Array.isArray(data)
      ? data
      : data.data || data.results || [];

    return products;
  } catch (error) {
    console.error("Ошибка загрузки опций фильтров:", error);
    return [];
  }
}

function getUniqueValues(array, key) {
  return [...new Set(array.map((item) => item[key]))].filter(Boolean).sort();
}

function getModelsByBrand(products, brand) {
  if (!brand) return [];
  return getUniqueValues(
    products.filter((p) => p.make === brand),
    "model",
  );
}

async function populateFilters() {
  const products = await fetchFilterOptions();

  const brands = getUniqueValues(products, "make");
  const brandSelect = document.getElementById("brand-filter");
  brandSelect.innerHTML = '<option value="">Все марки</option>';
  brands.forEach((brand) => {
    brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
  });

  const engineTypes = getUniqueValues(products, "engine_type").filter(
    (type) => type !== "unknown" && type !== "",
  );
  const engineTypeSelect = document.getElementById("engine-type-filter");
  engineTypeSelect.innerHTML = '<option value="">Все типы</option>';
  engineTypes.forEach((type) => {
    engineTypeSelect.innerHTML += `<option value="${type}">${type}</option>`;
  });

  // Сохраняем продукты для обновления моделей
  window.cachedProducts = products;
}

function updateModelOptions(selectedBrand) {
  const modelSelect = document.getElementById("model-filter");
  modelSelect.innerHTML = '<option value="">Все модели</option>';

  if (selectedBrand && window.cachedProducts) {
    const models = getModelsByBrand(window.cachedProducts, selectedBrand);
    models.forEach((model) => {
      modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
    });
    modelSelect.disabled = false;
  } else {
    modelSelect.disabled = true;
  }
}

async function applyFilters(formData) {
  currentFilters = formData;
  currentPage = 1;
  totalItems = 0; // Сбрасываем чтобы пересчитать с новыми фильтрами
  await updateDisplay();
}

function getTotalPages() {
  return Math.ceil(totalItems / itemsPerPage);
}

function renderPagination() {
  const totalPages = getTotalPages();
  const paginationContainer = document.querySelector(".pagination");

  if (totalPages <= 1 && !hasMorePages) {
    paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = "";

  paginationHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage - 1}">Предыдущая</a>
    </li>
  `;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = hasMorePages ? currentPage + 2 : totalPages;

  // Показываем первую страницу
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

  // Показываем страницы вокруг текущей
  for (let i = startPage; i <= Math.min(endPage, totalPages); i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  // Если есть ещё страницы - показываем многоточие и следующую кнопку
  if (hasMorePages && currentPage < totalPages) {
    paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
  }

  // Кнопка "Следующая"
  const isLastPage = !hasMorePages && currentPage === totalPages;
  paginationHTML += `
    <li class="page-item ${isLastPage ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="${currentPage + 1}">Следующая</a>
    </li>
  `;

  paginationContainer.innerHTML = paginationHTML;
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
  const mainImage = images && images.length > 0 ? images[0] : "";

  return `
    <div class="col-lg-4 col-md-6 col-sm-12">
      <div class="${cardClass}">
        <div class="product-card__image">
          <div class="product-card__loader" data-product="${product_id}">
            <img src="./icon/status.svg" alt="Загрузка...">
          </div>
          
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
          </ul>
           <div class="product-card__price">
            ${formattedPrice} ₽</div>
            <small>Актуальную цену уточняйте у менеджера</small>
           
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

function handleImageLoading() {
  const images = document.querySelectorAll(".product-card__img");

  images.forEach((img) => {
    const productId = img.dataset.product;
    const loader = document.querySelector(
      `.product-card__loader[data-product="${productId}"]`,
    );

    img.addEventListener("load", function () {
      this.style.display = "block";
      if (loader) loader.style.display = "none";
    });

    img.addEventListener("error", function () {
      this.src = "";
      if (loader) loader.style.display = "none";
    });
  });
}

async function updateDisplay() {
  showLoadingIndicator();
  const result = await fetchEngines(currentFilters, currentPage);

  if (!result) {
    return;
  }

  const { products, hasMore, total } = result;

  // Если API вернул total - используем его
  if (total !== null && total !== undefined) {
    totalItems = total;
  } else {
    // Иначе считаем приблизительно
    if (hasMore) {
      totalItems = currentPage * itemsPerPage + 1; // Минимум ещё одна страница есть
    } else {
      totalItems = (currentPage - 1) * itemsPerPage + products.length;
    }
  }

  hasMorePages = hasMore;

  // Обновляем счетчик результатов
  // const resultsElement = document.querySelector(".catalogue__results strong");
  // if (resultsElement) {
  //   if (total !== null && total !== undefined) {
  //     resultsElement.textContent = total;
  //   } else {
  //     resultsElement.textContent = hasMorePages ? `${totalItems}+` : totalItems;
  //   }
  // }

  const productsGrid = document.getElementById("products-grid");

  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          <h4>Ничего не найдено</h4>
          <p>Попробуйте изменить параметры фильтрации</p>
        </div>
      </div>
    `;
  } else {
    productsGrid.innerHTML = products
      .map((product) => renderProductCard(product))
      .join("");

    handleImageLoading();
  }

  renderPagination();

  // Скролл к результатам (кроме первой загрузки)
  if (!isInitialLoad) {
    const catalogueContent = document.querySelector(".catalogue__content");
    if (catalogueContent) {
      catalogueContent.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
}

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
  document.getElementById("brand-filter").addEventListener("change", (e) => {
    updateModelOptions(e.target.value);
    document.getElementById("model-filter").value = "";
  });

  document.getElementById("filters-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = getCurrentFormData();
    applyFilters(formData);
  });

  document.getElementById("filters-form").addEventListener("reset", () => {
    setTimeout(() => {
      document.getElementById("model-filter").disabled = true;
      currentFilters = {};
      currentPage = 1;
      updateDisplay();
    }, 0);
  });

  document.getElementById("sort-select").addEventListener("change", (e) => {
    // Сортировка - можно добавить если API поддерживает
    console.log("Сортировка:", e.target.value);
    // TODO: Добавить параметр sort в buildApiUrl если нужно
  });

  document.querySelector(".pagination").addEventListener("click", async (e) => {
    e.preventDefault();
    if (e.target.tagName === "A" && !e.target.closest(".disabled")) {
      const page = parseInt(e.target.dataset.page);
      if (page && page !== currentPage && page > 0) {
        currentPage = page;
        await updateDisplay();
      }
    }
  });
}

function showLoadingIndicator() {
  const productsGrid = document.getElementById("products-grid");
  if (productsGrid) {
    productsGrid.innerHTML = `
      <div class="col-12 text-center py-5">
         <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    style="
                      margin: auto;
                      background: none;
                      display: block;
                      shape-rendering: auto;
                    "
                    width="100px"
                    height="100px"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid"
                  >
                    <g transform="rotate(0 50 50)">
                      <rect
                        x="47"
                        y="24"
                        rx="3"
                        ry="6"
                        width="6"
                        height="12"
                        fill="#FF6B35"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="1s"
                          begin="-0.9166666666666666s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(30 50 50)">
                      <rect
                        x="47"
                        y="24"
                        rx="3"
                        ry="6"
                        width="6"
                        height="12"
                        fill="#FF6B35"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="1s"
                          begin="-0.8333333333333334s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(60 50 50)">
                      <rect
                        x="47"
                        y="24"
                        rx="3"
                        ry="6"
                        width="6"
                        height="12"
                        fill="#FF6B35"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="1s"
                          begin="-0.75s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(90 50 50)">
                      <rect
                        x="47"
                        y="24"
                        rx="3"
                        ry="6"
                        width="6"
                        height="12"
                        fill="#FF6B35"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="1s"
                          begin="-0.6666666666666666s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(120 50 50)">
                      <rect
                        x="47"
                        y="24"
                        rx="3"
                        ry="6"
                        width="6"
                        height="12"
                        fill="#FF6B35"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="1s"
                          begin="-0.5833333333333334s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(150 50 50)">
                      <rect
                        x="47"
                        y="24"
                        rx="3"
                        ry="6"
                        width="6"
                        height="12"
                        fill="#FF6B35"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="1s"
                          begin="-0.5s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(180 50 50)">
                      <rect
                        x="47"
                        y="24"
                        rx="3"
                        ry="6"
                        width="6"
                        height="12"
                        fill="#FF6B35"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="1s"
                          begin="-0.4166666666666667s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(210 50 50)">
                      <rect
                        x="47"
                        y="24"
                        rx="3"
                        ry="6"
                        width="6"
                        height="12"
                        fill="#FF6B35"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="1s"
                          begin="-0.3333333333333333s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(240 50 50)">
                      <rect
                        x="47"
                        y="24"
                        rx="3"
                        ry="6"
                        width="6"
                        height="12"
                        fill="#FF6B35"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="1s"
                          begin="-0.25s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(270 50 50)">
                      <rect
                        x="47"
                        y="24"
                        rx="3"
                        ry="6"
                        width="6"
                        height="12"
                        fill="#FF6B35"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="1s"
                          begin="-0.16666666666666666s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(300 50 50)">
                      <rect
                        x="47"
                        y="24"
                        rx="3"
                        ry="6"
                        width="6"
                        height="12"
                        fill="#FF6B35"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="1s"
                          begin="-0.08333333333333333s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(330 50 50)">
                      <rect
                        x="47"
                        y="24"
                        rx="3"
                        ry="6"
                        width="6"
                        height="12"
                        fill="#FF6B35"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="1s"
                          begin="0s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                  </svg>
        <p class="mt-3">Загрузка данных...</p>
      </div>
    `;
  }
}

function hideLoadingIndicator() {
  // Индикатор скрывается автоматически при рендере результатов
}

function showErrorMessage(message) {
  const productsGrid = document.getElementById("products-grid");
  if (productsGrid) {
    productsGrid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger text-center">
          <h4>Ошибка</h4>
          <p>${message}</p>
        </div>
      </div>
    `;
  }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
  await populateFilters();
  await updateDisplay();
  setupEventListeners();

  setTimeout(() => {
    isInitialLoad = false;
  }, 100);
});
