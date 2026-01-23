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
    if (e.target.closest(".sms")) {
      const modal = new bootstrap.Modal("#sendSms");
      modal.show();
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Делегирование событий - слушаем клики на родителе
  document.addEventListener("click", (e) => {
    if (e.target.closest(".vin")) {
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

// Функция рендера карточки
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

  const formattedPrice = price.toLocaleString("ru-RU");
  const inStock = stock_text !== "Продано";
  const badgeClass = inStock
    ? "product-card__badge"
    : "product-card__badge product-card__badge--sold";
  const badgeText = inStock ? "В наличии" : "Продано";
  const cardClass = inStock
    ? "product-card"
    : "product-card product-card--sold";
  const buttonDisabled = inStock ? "" : "disabled";
  const buttonText = inStock ? "Купить" : "Продано";
  const displayYear = year || "Не указан";
  const displayEngineType =
    engine_type === "unknown" || !engine_type ? "Не указан" : engine_type;
  const mainImage =
    images && images.length > 0 ? images[0] : "./img/engine-placeholder.jpg";

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
           <div class="product-card__price">${formattedPrice} ₽</div>
        </div>
        <div class="product-card__footer">
            <button class="btn product-card__btn product-card__btn vin" data-product-id="${product_id}" ${buttonDisabled}>
              Отправить VIN
            </button>
            <button class="btn product-card__btn product-card__btn-send sms" data-product-id="${product_id}" ${buttonDisabled}>
              Написать в мессенджер
            </button>
          </div>
      </div>
    </div>
  `;
}

// Рендер всех карточек
function renderProducts(products) {
  const productsGrid = document.getElementById("products-grid");
  productsGrid.innerHTML = products
    .map((product) => renderProductCard(product))
    .join("");
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  // productsData доступна из data.js
  renderProducts(enginesData);

  // Здесь будет логика фильтрации и пагинации
});
