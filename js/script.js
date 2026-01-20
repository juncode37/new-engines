// vin transform
document.querySelector(".hero__input").addEventListener("input", function (e) {
  e.target.value = e.target.value.toUpperCase();
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

// Call trigger button
const callTrigger = document.querySelector(".call-trigger");

if (callTrigger) {
  callTrigger.addEventListener("click", () => {
    const modal = new bootstrap.Modal("#sendVin");
    modal.show();
  });
}
function CallTriggerMove() {
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop  > window.innerHeight / 5 ) {
      callTrigger.classList.remove("call-trigger-center");
      callTrigger.classList.add("call-trigger-bottom");
    } else {
      callTrigger.classList.remove("call-trigger-bottom");
      callTrigger.classList.add("call-trigger-center");
    }
    console.log(scrollTop, window.innerHeight);
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

// send messages
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

// reviews slider

// data
const reviews = [
  {
    id: 1,
    name: "Алексей Петров",
    date: "15.01.2026",
    car: "Toyota Camry",
    rating: 5,
    text: "Заказывал двигатель 2AZ-FE для Камри. Пришёл в отличном состоянии, компрессия отличная, масло чистое. Поставил без проблем, работает как часы. Очень доволен качеством и сервисом!",
  },
  {
    id: 2,
    name: "Дмитрий Соколов",
    date: "10.01.2026",
    car: "Honda CR-V",
    rating: 5,
    text: "Покупал контрактный K24A. Двигатель пришёл быстро, упакован надёжно. Все документы на месте, аукционный лист приложили. После установки прошёл уже 2000 км - никаких нареканий. Рекомендую!",
  },
  {
    id: 3,
    name: "Сергей Иванов",
    date: "05.01.2026",
    car: "Nissan X-Trail",
    rating: 4,
    text: "Заказывал QR25DE для X-Trail. Двигатель хороший, но доставка заняла чуть больше времени, чем обещали. В остальном всё отлично - компрессия в норме, работает тихо.",
  },
  {
    id: 4,
    name: "Михаил Васильев",
    date: "28.12.2025",
    car: "Mazda CX-5",
    rating: 5,
    text: "Отличный сервис! Помогли с подбором двигателя по VIN, всё объяснили, ответили на все вопросы. Двигатель PE-VPS пришёл в идеальном состоянии. Большое спасибо!",
  },
  {
    id: 5,
    name: "Андрей Кузнецов",
    date: "20.12.2025",
    car: "Subaru Forester",
    rating: 5,
    text: "Брал EJ20 для Форестера. Двигатель оригинальный японский, с минимальным пробегом. Все проверки прошёл на отлично. Ребята молодцы, работают честно!",
  },
  {
    id: 6,
    name: "Владимир Морозов",
    date: "15.12.2025",
    car: "Toyota RAV4",
    rating: 5,
    text: "Заказывал 2GR-FE. Очень порадовало качество упаковки - деревянная обрешётка, всё защищено. Двигатель чистый, компрессия отличная. Поставил и забыл про проблемы!",
  },
  {
    id: 7,
    name: "Олег Смирнов",
    date: "10.12.2025",
    car: "Honda Accord",
    rating: 4,
    text: "Двигатель K20A хороший, но хотелось бы больше фото перед отправкой. В целом доволен - работает без нареканий, масло не жрёт.",
  },
  {
    id: 8,
    name: "Игорь Павлов",
    date: "05.12.2025",
    car: "Nissan Qashqai",
    rating: 5,
    text: "Отличный магазин! Заказывал MR20DE, всё пришло быстро и качественно. Двигатель проверили перед отправкой, показали видео с замером компрессии. Супер!",
  },
];

// data end

// slider
let offset = 0;
const gap = 24;

const sliderWrap = document.querySelector(".slider__wrap");
const sliderCont = document.querySelector(".slider__cont");
const nextBtn = document.querySelector(".slider__btn-next");
const prevBtn = document.querySelector(".slider__btn-prev");

reviews.forEach((element) => {
  sliderCont.insertAdjacentHTML(
    "beforeend",
    `
     <article class="slider__item p-3">
      <div class="d-flex slider__header mb-3">
        <div class="slider__ico me-3">
          <img src="./icon/user_ico.png" alt="${element.name}" />
        </div>
        <div class="overflow-hidden">
          <div class="slider__descr text-left">
            <h5 class="mb-1">${element.name}</h5>
            <p class="mb-1 text-muted small">${element.car}</p>
            <p class="mb-0 text-muted small">${element.date}</p>
          </div>
        </div>
      </div>
      <div class="slider__body">
        <p class="mb-0">${element.text}</p>
      </div>
    </article>
    `,
  );
});

const slides = document.querySelectorAll(".slider__item");
let slideWidthValue = 0;

function updateSlideWidth() {
  const containerWidth = sliderWrap.clientWidth;

  let slidesToShow = 4;
  let currentGap = gap;

  if (window.innerWidth < 768) {
    slidesToShow = 1;
    currentGap = 0;
  } else if (window.innerWidth < 990) {
    slidesToShow = 2;
  } else if (window.innerWidth < 1199) {
    slidesToShow = 3;
  }

  if (slidesToShow === 1 && window.innerWidth < 768) {
    const container = document.querySelector(".container");
    const containerStyles = window.getComputedStyle(container);
    const paddingLeft = parseFloat(containerStyles.paddingLeft);
    const paddingRight = parseFloat(containerStyles.paddingRight);

    slideWidthValue = containerWidth - paddingLeft - paddingRight;
  } else {
    slideWidthValue =
      (containerWidth - currentGap * (slidesToShow - 1)) / slidesToShow;
  }

  slides.forEach((slide) => {
    slide.style.width = `${slideWidthValue}px`;
  });

  const totalGaps = slides.length > 1 ? (slides.length - 1) * currentGap : 0;
  sliderCont.style.width = slideWidthValue * slides.length + totalGaps + "px";

  offset = 0;
  sliderCont.style.transform = `translateX(-${offset}px)`;
  showArrow();
}

function showArrow() {
  let slidesToShow = 4;
  if (window.innerWidth < 768) slidesToShow = 1;
  else if (window.innerWidth < 990) slidesToShow = 2;
  else if (window.innerWidth < 1199) slidesToShow = 3;

  const maxOffset = (slideWidthValue + gap) * (slides.length - slidesToShow);
  prevBtn.hidden = offset <= 0;
  nextBtn.hidden = offset >= maxOffset;
}

nextBtn.addEventListener("click", () => {
  let slidesToShow =
    window.innerWidth < 768
      ? 1
      : window.innerWidth < 990
        ? 2
        : window.innerWidth < 1199
          ? 3
          : 4;

  const maxOffset = (slideWidthValue + gap) * (slides.length - slidesToShow);
  offset = Math.min(offset + slideWidthValue + gap, maxOffset);
  sliderCont.style.transform = `translateX(-${offset}px)`;
  showArrow();
});

prevBtn.addEventListener("click", () => {
  offset = Math.max(offset - (slideWidthValue + gap), 0);
  sliderCont.style.transform = `translateX(-${offset}px)`;
  showArrow();
});

window.addEventListener("resize", updateSlideWidth);

updateSlideWidth();

// reviews slider end
