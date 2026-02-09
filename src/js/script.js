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

// send messages
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

// reviews slider

// data
const reviews = [
  {
    id: 1,
    name: "Петр",
    date: "02.02.2026",
    car: "Toyota Camry",
    rating: 5,
    text: "Искал движок 2AZ месяца два. Тут нашли за 5 дней! Приехало всё идеально - навесное на месте, проводка целая. Поставил сам, завелась сразу. Проехал уже 1500, полёт отличный. Цена кстати тоже адекватная была.",
  },
  {
    id: 2,
    name: "Соколов Д.М.",
    date: "25.01.2026",
    car: "Honda CR-V",
    rating: 4,
    text: "Мотор K24 хороший, претензий по качеству нет. Единственное - пришлось подождать недельку, но предупредили сразу что будут искать лучший вариант. В итоге не пожалел, компрессия огонь, сухой весь.",
  },
  {
    id: 3,
    name: "Иванов Сергей",
    date: "19.01.2026",
    car: "Nissan X-Trail",
    rating: 5,
    text: "Ребята топчик! Взял QR25, переживал что какая-то фигня приедет. А тут вообще красота - чистый, без подтёков, поддон блестит. Документы японские оригинальные приложили. Теперь всем знакомым советую!",
  },
  {
    id: 4,
    name: "Михаил В.",
    date: "11.01.2026",
    car: "Mazda CX-5",
    rating: 5,
    text: "Менеджер Артем вообще красавчик - подобрал вариант под мой бюджет, всю инфу по телефону рассказал. Двигатель привезли упакованный в термоплёнку + деревянная обрешётка. Сервис реально на уровне!",
  },
  {
    id: 5,
    name: "Кузнецов А.",
    date: "04.01.2026",
    car: "Subaru Forester",
    rating: 5,
    text: "EJ20 брал для Фореста 2008г. Нашли с малым пробегом, привезли быстро. Самое крутое - дали реально протестировать перед установкой, замерили компрессию при мне. Всё честно, работает бодро!",
  },
  {
    id: 6,
    name: "Владимир",
    date: "28.12.2025",
    car: "Toyota RAV4",
    rating: 4,
    text: "В целом норм. Мотор 2GR рабочий, установили без проблем. Немного смутило что на блоке были следы от демонтажа, но это мелочи. За свои деньги вполне достойный вариант получился.",
  },
  {
    id: 7,
    name: "Смирнов Олег Петрович",
    date: "20.12.2025",
    car: "Honda Accord",
    rating: 5,
    text: "Покупал K20A в ноябре, поставили в декабре. Работает тише чем родной был! Масло вообще не ест, расход в норме. Менеджеры грамотные, без впаривания допов. Рекомендую однозначно.",
  },
  {
    id: 8,
    name: "Павлов Игорь",
    date: "15.12.2025",
    car: "Nissan Qashqai",
    rating: 5,
    text: "Заказывал через сайт, перезвонили за 10 минут. Всё объяснили, выслали фотки движка перед отправкой. MR20 пришёл за 4 дня, упакован отлично. Поставил в сервисе - мастера сказали что состояние огонь. Спасибо!",
  },
  {
    id: 9,
    name: "Женя",
    date: "08.12.2025",
    car: "Mitsubishi Outlander",
    rating: 5,
    text: "Не ожидал что будет настолько качественно! Двигатель чистый, все датчики целые, проводка не обрезана. Даже аукционник показали с переводом. Поставил - завелась моментально. Теперь езжу довольный)",
  },
  {
    id: 10,
    name: "Федоров К.",
    date: "01.12.2025",
    car: "Toyota Land Cruiser Prado",
    rating: 5,
    text: "Искал 1GR-FE больше месяца по всему городу. Только тут смогли найти нормальный вариант! С полным навесным, со всеми фишками. Прадо ожил, тянет как зверь. Цена правда кусается, но качество того стоит.",
  },
  {
    id: 11,
    name: "Роман Л.",
    date: "22.11.2025",
    car: "Mazda 6",
    rating: 4,
    text: "Взял мотор для шестёрки. Работает норм, никаких проблем. Просто ожидал что доставка будет быстрее, но это не критично. Главное что товар качественный пришёл, компрессия в норме.",
  },
  {
    id: 12,
    name: "Новиков Виктор",
    date: "14.11.2025",
    car: "Subaru Legacy",
    rating: 5,
    text: "Заказывал издалека, боялся что кинут. Но всё чётко - оплатил, через 2 дня отправили с треком. Движок EJ25 вообще шикарный оказался, даже лучше чем описывали. Претензий ноль!",
  },
  {
    id: 13,
    name: "Артур",
    date: "05.11.2025",
    car: "Honda Civic",
    rating: 5,
    text: "Ребята реально шарят в моторах! Подсказали какой лучше взять, объяснили разницу между вариантами. Взял D17A, поставили - работает тихо, плавно. Гарантию дали 30 дней, но она и не понадобилась.",
  },
  {
    id: 14,
    name: "Орлов Максим",
    date: "28.10.2025",
    car: "Nissan Murano",
    rating: 5,
    text: "Крутая контора! Быстро нашли VQ35, цена нормальная была. Привезли аккуратно упакованным, все пробки на месте. Установка прошла без сюрпризов. Уже месяц катаюсь - полёт нормальный!",
  },
  {
    id: 15,
    name: "Степанов П.И.",
    date: "19.10.2025",
    car: "Toyota Corolla",
    rating: 5,
    text: "Заказывал 1ZZ-FE для Короллы. Менеджер сразу предупредил что будет небольшая задержка, но нашли хороший вариант. Мотор пришёл чистый, ухоженный. Документы все оригинальные. Очень доволен!",
  },
  {
    id: 16,
    name: "Денис Ковалёв",
    date: "10.10.2025",
    car: "Mazda CX-7",
    rating: 4,
    text: "Нормальный магаз. Цены средние по рынку, качество хорошее. Двигатель L3-VDT пришёл рабочий, компрессия в норме. Немного напряг что нет фоток в процессе доставки, но в целом претензий нет.",
  },
  {
    id: 17,
    name: "Николай Т.",
    date: "01.10.2025",
    car: "Subaru Impreza",
    rating: 5,
    text: "Брал EJ20 для Импрезы. Переживал жёстко, первый раз такое покупал. Но тут всё объяснили, показали видео с разборки. Мотор привезли быстро, поставил - едет как надо. Молодцы, честные ребята!",
  },
  {
    id: 18,
    name: "Зайцев Станислав",
    date: "22.09.2025",
    car: "Honda Fit",
    rating: 5,
    text: "Отличный сервис! L13A нашли за 3 дня, хотя обещали неделю. Упаковка супер - ни одной царапины. Менеджер потом ещё звонил, интересовался как установка прошла. Приятно когда люди за репутацию следят!",
  },
  {
    id: 19,
    name: "Антон",
    date: "12.09.2025",
    car: "Nissan Teana",
    rating: 5,
    text: "Заказывал VQ23. Сначала думал что дорого, но потом сравнил с другими - цена норм. Движок класс, чистый весь, без подтёков. Поставили в сервисе - мастер сказал что японец оригинальный. Доволен!",
  },
  {
    id: 20,
    name: "Геннадий Савельев",
    date: "03.09.2025",
    car: "Toyota Highlander",
    rating: 5,
    text: "Покупал 2GR-FE для Хайлендера 2010г. Ребята помогли с выбором, показали несколько вариантов. Взял тот что подороже - не пожалел! Мотор как новый, все прокладки свежие. Работает идеально, спасибо!",
  },
  {
    id: 21,
    name: "Руслан К.",
    date: "25.08.2025",
    car: "Mazda Axela",
    rating: 3,
    text: "Движок ZY работает, но были небольшие нюансы при установке - пришлось докупать пару датчиков. Хотелось бы чтоб предупреждали о таких моментах сразу. В остальном норм, цена адекватная.",
  },
  {
    id: 22,
    name: "Сидоров Кирилл",
    date: "15.08.2025",
    car: "Subaru Outback",
    rating: 5,
    text: "EZ30 для Аутбека нашли за неделю! Мотор шестицилиндровый, редкий. Привезли с полным навесным, даже генератор и стартер были. Установка прошла без проблем. Однозначно рекомендую компанию!",
  },
  {
    id: 23,
    name: "Дима",
    date: "05.08.2025",
    car: "Honda Stepwgn",
    rating: 5,
    text: "Брал K20A для степика. Переживал что попадёт убитый мотор, но нет - всё супер! Компрессия отличная, масло чистое. Документы с аукциона приложили. Доставка быстрая. Всё четко работает!",
  },
  {
    id: 24,
    name: "Морозов Алексей",
    date: "26.07.2025",
    car: "Nissan Serena",
    rating: 5,
    text: "Заказывал SR20 для Серены. Менеджер Игорь помог с подбором, объяснил все отличия между вариантами. Мотор пришёл упакованный профессионально. Поставили - машина ожила! Едет бодро, расход в норме. Супер!",
  },
  {
    id: 25,
    name: "Владимир Ж.",
    date: "15.07.2025",
    car: "Toyota Vitz",
    rating: 4,
    text: "Двигатель 1NZ-FE рабочий, установили без проблем. Немного смутило что компрессия в одном цилиндре чуть ниже, но в пределах нормы. За такую цену вполне норм вариант. Пока полёт нормальный.",
  },
  {
    id: 26,
    name: "Семёнов И.П.",
    date: "05.07.2025",
    car: "Mazda Demio",
    rating: 5,
    text: "Отличная компания! ZJ-VE нашли быстро, привезли аккуратно. Менеджеры вежливые, всё понятно объясняют. Гарантию дали письменную. Мотор после установки работает тихо, масло не ест. Молодцы, так держать!",
  },
  {
    id: 27,
    name: "Коля",
    date: "22.06.2025",
    car: "Subaru XV",
    rating: 5,
    text: "Первый раз брал контрактник, друг посоветовал этих ребят. FB20 пришёл в отличном состоянии! Упаковка надёжная, все датчики на месте. Поставил в сервисе - завелась с пол-оборота. Теперь знаю куда обращаться, спасибо!",
  },
  {
    id: 28,
    name: "Круглов Андрей",
    date: "10.06.2025",
    car: "Honda CR-Z",
    rating: 5,
    text: "Искал гибридный мотор LEA для CR-Z по всей стране! Только тут нашли и ещё в хорошем состоянии. Батарея держит отлично, электроника вся целая. Цена конечно не маленькая, но за такую редкость - норм. Очень доволен!",
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

// animation pistons

let animationProgress = 0;

function animatePistons() {
  const scrollY = window.scrollY;

  animationProgress = scrollY / 100;

  const pistons = document.querySelectorAll(".piston");

  pistons.forEach((piston) => {
    const phase = parseFloat(piston.dataset.phase);

    const angle = animationProgress + (phase * Math.PI) / 180;

    const position = Math.cos(angle);

    const amplitude = 40;

    piston.style.transform = `translateY(${position * amplitude}px)`;
  });
}

// let ticking = false;
// window.addEventListener("scroll", () => {
//   if (!ticking) {
//     window.requestAnimationFrame(() => {
//       animatePistons();
//       ticking = false;
//     });
//     ticking = true;
//   }
// });

// animatePistons();
// animation pistons end

// callback form

const statuses = {
  loading: "./icon/status.svg",
  succes: "Заявка на обратный звонок успешно отправленна!",
  error: "Ошибка отравки! Попробуйте позже",
};

const callBackForm = document.getElementById("callback-form");

callBackForm.addEventListener("submit", async function (e) {
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
  const statusText = document.querySelector(".status-modal__text");
  const callbackBtn = document.querySelector(".callback__btn");

  callbackBtn.textContent = "";
  callbackBtn.append(status);

  const formData = new FormData(this);

  // const brand = formData.get("brand");
  const vin = formData.get("vin") ? formData.get("vin") : "нет VIN";
  const name = formData.get("username");
  const phone = "+7" + formData.get("phone");

  const message = `
🆕 *Новая заявка Лучшиезапчасти.РФ*
    *Главная страница*

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

// callback form end
