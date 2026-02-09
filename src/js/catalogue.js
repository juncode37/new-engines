let isInitialLoad = true;

const formatPhone = (phone) =>
  phone.replace(/^(\+7)(\d{3})(\d{3})(\d{2})(\d{2})$/, "$1 ($2) $3 $4 $5");

const PHONE_NUMBER = "+79277673866";
const PHONE_DISPLAY = formatPhone(PHONE_NUMBER);

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
   

    case "telegram":
      url = `https://t.me/Zapchastikach?text=${encodedMessage}`;
      break;

    case "max":
      navigator.clipboard.writeText(message);
      url = `https://max.ru/u/f9LHodD0cOIP0KhWuXiQAMzyqxXPqM-qYCefys2HKX9VUfK8mn7BxCG69xU`;
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

    const BOT_TOKEN = "8587190797:AAG4Heb0rwqBhlFj6EFrQ5VJOtq8WemUQS0";
    const CHAT_ID = "-1003766386896";
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

const API_BASE_URL = "https://api.xn--80aanidep0btkd2cfi.xn--p1ai/engines/";
const FILTERS_BASE_URL = "https://api.xn--80aanidep0btkd2cfi.xn--p1ai/filters/";
const itemsPerPage = 9;

let currentPage = 1;
let currentFilters = {};
let totalItems = 0;
let hasMorePages = true;
let isLoading = false;

function buildApiUrl(filters, page) {
  const params = new URLSearchParams();

  params.append("limit", itemsPerPage);
  params.append("offset", (page - 1) * itemsPerPage);

  if (filters.brand) params.append("make", filters.brand);
  if (filters.model) params.append("model", filters.model);
  if (filters.year) params.append("year", filters.year);
  if (filters.engineType) params.append("engine_type", filters.engineType);
  if (filters.priceFrom) params.append("price_min", filters.priceFrom);
  if (filters.priceTo) params.append("price_max", filters.priceTo);

  return `${API_BASE_URL}?${params.toString()}`;
}

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

    if (Array.isArray(data)) {
      return {
        products: data,
        hasMore: data.length === itemsPerPage,
      };
    }

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
  }
}

async function fetchMakes() {
  try {
    const response = await fetch(`${FILTERS_BASE_URL}makes`, {
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.makes || data.data || [];
  } catch (error) {
    console.error("Ошибка загрузки марок:", error);
    return [];
  }
}

async function fetchModels(make) {
  try {
    const url = make
      ? `${FILTERS_BASE_URL}models?make=${encodeURIComponent(make)}`
      : `${FILTERS_BASE_URL}models`;

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.models || data.data || [];
  } catch (error) {
    console.error("Ошибка загрузки моделей:", error);
    return [];
  }
}

async function populateFilters() {
  const makes = await fetchMakes();
  const brandSelect = document.getElementById("brand-filter");

  if (!brandSelect) return;

  brandSelect.innerHTML = '<option value="">Все марки</option>';
  makes.forEach((make) => {
    const makeName = typeof make === "string" ? make : make.name || make.make;
    brandSelect.innerHTML += `<option value="${makeName}">${makeName}</option>`;
  });

  const engineTypeSelect = document.getElementById("engine-type-filter");
  if (engineTypeSelect) {
    engineTypeSelect.innerHTML = '<option value="">Все типы</option>';
  }
}

async function updateModelOptions(selectedBrand) {
  const modelSelect = document.getElementById("model-filter");

  if (!modelSelect) return;

  modelSelect.innerHTML = '<option value="">Все модели</option>';

  if (selectedBrand) {
    const models = await fetchModels(selectedBrand);
    models.forEach((model) => {
      const modelName =
        typeof model === "string" ? model : model.name || model.model;
      modelSelect.innerHTML += `<option value="${modelName}">${modelName}</option>`;
    });
    modelSelect.disabled = false;
  } else {
    modelSelect.disabled = true;
  }
}

async function applyFilters(formData) {
  currentFilters = formData;
  currentPage = 1;
  totalItems = 0;
  await updateDisplay();
}

function getTotalPages() {
  return Math.ceil(totalItems / itemsPerPage);
}

function renderPagination() {
  const totalPages = getTotalPages();
  const paginationContainer = document.querySelector(".pagination");

  if (!paginationContainer) return;

  if (totalPages <= 1 && !hasMorePages) {
    paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = "";

  paginationHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="javascript:void(0)" data-page="${currentPage - 1}">Предыдущая</a>
    </li>
  `;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = hasMorePages ? currentPage + 2 : totalPages;

  if (startPage > 1) {
    paginationHTML += `
      <li class="page-item">
        <a class="page-link" href="javascript:void(0)" data-page="1">1</a>
      </li>
    `;
    if (startPage > 2) {
      paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  for (let i = startPage; i <= Math.min(endPage, totalPages); i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="javascript:void(0)" data-page="${i}">${i}</a>
      </li>
    `;
  }

  if (hasMorePages && currentPage < totalPages) {
    paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
  }

  const isLastPage = !hasMorePages && currentPage === totalPages;
  paginationHTML += `
    <li class="page-item ${isLastPage ? "disabled" : ""}">
      <a class="page-link" href="javascript:void(0)" data-page="${currentPage + 1}">Следующая</a>
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
  if (!isInitialLoad) {
    const catalogueContent = document.querySelector("#catalogue");
    if (catalogueContent) {
      catalogueContent.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  showLoadingIndicator();

  const result = await fetchEngines(currentFilters, currentPage);

  if (!result) {
    return;
  }

  const { products, hasMore, total } = result;

  if (total !== null && total !== undefined) {
    totalItems = total;
  } else {
    if (hasMore) {
      totalItems = currentPage * itemsPerPage + 1;
    } else {
      totalItems = (currentPage - 1) * itemsPerPage + products.length;
    }
  }

  hasMorePages = hasMore;

  const productsGrid = document.getElementById("products-grid");

  if (!productsGrid) return;

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
}

function getCurrentFormData() {
  const brandFilter = document.getElementById("brand-filter");
  const modelFilter = document.getElementById("model-filter");
  const yearFilter = document.getElementById("year-filter");
  const engineTypeFilter = document.getElementById("engine-type-filter");
  const priceFrom = document.getElementById("price-from");
  const priceTo = document.getElementById("price-to");

  return {
    brand: brandFilter ? brandFilter.value : "",
    model: modelFilter ? modelFilter.value : "",
    year: yearFilter ? yearFilter.value : "",
    engineType: engineTypeFilter ? engineTypeFilter.value : "",
    priceFrom: priceFrom ? priceFrom.value : "",
    priceTo: priceTo ? priceTo.value : "",
  };
}

function setupEventListeners() {
  const brandFilter = document.getElementById("brand-filter");
  const filtersForm = document.getElementById("filters-form");
  const sortSelect = document.getElementById("sort-select");
  const pagination = document.querySelector(".pagination");

  if (brandFilter) {
    brandFilter.addEventListener("change", async (e) => {
      await updateModelOptions(e.target.value);
      const modelFilter = document.getElementById("model-filter");
      if (modelFilter) {
        modelFilter.value = "";
      }
    });
  }

  if (filtersForm) {
    filtersForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = getCurrentFormData();
      applyFilters(formData);
    });

    filtersForm.addEventListener("reset", () => {
      setTimeout(() => {
        const modelFilter = document.getElementById("model-filter");
        if (modelFilter) {
          modelFilter.disabled = true;
        }
        currentFilters = {};
        currentPage = 1;
        updateDisplay();
      }, 0);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      console.log("Сортировка:", e.target.value);
    });
  }

  if (pagination) {
    pagination.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target.closest(".page-link");
      if (target && !target.closest(".disabled")) {
        const page = parseInt(target.dataset.page);
        if (page && page !== currentPage && page > 0) {
          currentPage = page;
          await updateDisplay();
        }
      }
    });
  }
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

document.addEventListener("DOMContentLoaded", async () => {
  const catalogueElement = document.getElementById("catalogue");
  if (!catalogueElement) return;

  await populateFilters();
  await updateDisplay();
  setupEventListeners();

  setTimeout(() => {
    isInitialLoad = false;
  }, 100);
});
