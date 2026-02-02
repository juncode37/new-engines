const PHONE_NUMBER = "+79127778234";
const PHONE_DISPLAY = "+7 (912) 777 82 34";

document.addEventListener("DOMContentLoaded", function () {
  const phoneLinks = document.querySelectorAll(".ph-n");
  
  phoneLinks.forEach((link) => {
    link.href = `tel:${PHONE_NUMBER}`;
    
   
    if (!link.querySelector('*')) {
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
  {
    id: 9,
    name: "Евгений",
    date: "24.01.2026",
    car: "Mitsubishi Outlander",
    rating: 5,
    text: "Первый раз покупал контрактник, переживал жутко. Менеджер Юра всё разжевал, даже видеозвонок сделали - показали мотор вживую со всех сторон. Приехало всё целое, даже быстрее чем обещали. Теперь только к вам!",
  },
  {
    id: 10,
    name: "Константин Ф.",
    date: "22.01.2026",
    car: "Toyota Land Cruiser Prado",
    rating: 5,
    text: "Ребята реально шарят! Нашли именно тот вариант который я хотел - с навесным, со всеми датчиками. Консультация на высшем уровне, никакого впаривания. Прадик ожил, работает как зверь. Спасибо огромное!",
  },
  {
    id: 11,
    name: "Роман",
    date: "18.01.2026",
    car: "Mazda 6",
    rating: 4,
    text: "Нормально всё. Доставка правда затянулась на пару дней, но предупредили заранее. Мотор рабочий, без сюрпризов. Цена адекватная. В принципе рекомендую",
  },
  {
    id: 12,
    name: "Виктор Новиков",
    date: "12.01.2026",
    car: "Subaru Legacy",
    rating: 5,
    text: "Заказывал из Хабаровска. Сначала думал что обманут, деньги ж вперёд. Но нет - ребята честные, всё по делу. Отправили фотки, документы, трек номер. Движок пришёл вообще огонь, даже лучше чем ожидал!",
  },
  {
    id: 13,
    name: "Артём",
    date: "08.01.2026",
    car: "Honda Civic",
    rating: 5,
    text: "Вообще красавцы! Помогли сэкономить прилично - подобрали аналог подешевле, который тоже подходит. Работает отлично, претензий ноль. Буду всем советовать",
  },
  {
    id: 14,
    name: "Максим О.",
    date: "03.01.2026",
    car: "Nissan Murano",
    rating: 5,
    text: "Долго выбирал где брать. Здесь понравилось что не парятся, отвечают по существу. Мне важно было чтоб с гарантией - дали. Поставили уже месяц назад, полёт нормальный. Всё ок",
  },
  {
    id: 15,
    name: "Павел Степанов",
    date: "30.12.2025",
    car: "Toyota Corolla",
    rating: 5,
    text: "Заказал перед НГ, думал не успеют. Ребята вообще молодцы - за 3 дня всё сделали! Мотор чистый, ухоженный. Документы все оригинальные. Очень благодарен за оперативность!",
  },
  {
    id: 16,
    name: "Денис",
    date: "25.12.2025",
    car: "Mazda CX-7",
    rating: 4,
    text: "В целом доволен. Единственное что немного напряг - пришлось ждать 10 дней, искали вариант получше. Зато результат стоящий, мотор реально в хорошем состоянии. Можно было бы и быстрее конечно",
  },
  {
    id: 17,
    name: "Аноним",
    date: "18.12.2025",
    car: "Subaru Impreza",
    rating: 5,
    text: "Не хочу светиться, но отзыв оставлю. Ребята топ! Быстро, качественно, недорого. Движок бодрый, едет как надо. Рекомендую 👍",
  },
  {
    id: 18,
    name: "Станислав Зайцев",
    date: "12.12.2025",
    car: "Honda Fit",
    rating: 5,
    text: "Крутая компания! Менеджер Антон вообще красава - на все вопросы ответил, даже по мелочам консультировал уже после покупки. Мотор пришёл быстро, упаковка огонь. Работает тихо, масло не ест. Доволен!",
  },
  {
    id: 19,
    name: "Антон В.",
    date: "08.12.2025",
    car: "Nissan Teana",
    rating: 5,
    text: "Брал для Теаны. Сервис понравился - всё чётко, без лишней воды. Цены нормальные, не задирают. Двигатель привезли аккуратно упакованный, с поддона сняли вместе прямо при мне. Всё честно, рекомендую!",
  },
  {
    id: 20,
    name: "Геннадий",
    date: "02.12.2025",
    car: "Toyota Highlander",
    rating: 5,
    text: "Покупал для Хайлендера. Приятно удивлён качеством! Мотор как с картинки - чистый, ухоженный, видно что не убитый. Все прокладки свежие. Ребята реально следят за репутацией. Спасибо за работу!",
  },
  {
    id: 21,
    name: "Руслан",
    date: "28.11.2025",
    car: "Mazda Axela",
    rating: 4,
    text: "Нормас. Взял тут мотор, поставил - всё работает. Единственный косяк был с курьером, но это не к магазину претензия. Сам товар качественный, цена приемлемая",
  },
  {
    id: 22,
    name: "Кирилл С.",
    date: "22.11.2025",
    car: "Subaru Outback",
    rating: 5,
    text: "Искал движок для Аутбека больше месяца по разным конторам. Тут нашли за неделю! Причём именно то что нужно было. Менеджеры шарят в теме, не просто продавцы. Мотор отличный, японец настоящий. Премного благодарен!",
  },
  {
    id: 23,
    name: "Дмитрий",
    date: "15.11.2025",
    car: "Honda Stepwgn",
    rating: 5,
    text: "Заказывал для степа. Переживал что попадётся какой-нибудь хлам, но всё супер! Мотор бодрый, компрессия отличная, всё работает как надо. Доставка быстрая, упаковка надёжная. Однозначно советую!",
  },
  {
    id: 24,
    name: "Алексей М.",
    date: "10.11.2025",
    car: "Nissan Serena",
    rating: 5,
    text: "Ребят, это лучшее что могло случиться с моей Сереной! Движок вообще огонь, работает тише чем старый был новый. Менеджер Сергей помог с выбором, объяснил все нюансы. Цена тоже порадовала - дешевле чем у конкурентов. Респект!",
  },
  {
    id: 25,
    name: "Владимир",
    date: "05.11.2025",
    car: "Toyota Vitz",
    rating: 4,
    text: "Взял мотор для Витца. В принципе всё норм, работает, проблем нет. Просто ожидал что будет совсем уж идеальный, а тут пара мелких царапин на блоке. Но это косметика, на работу не влияет. За свои деньги вполне",
  },
  {
    id: 26,
    name: "Игорь Семёнов",
    date: "28.10.2025",
    car: "Mazda Demio",
    rating: 5,
    text: "Отличная компания! Заказывал двигатель для Демио - привезли быстро, качественно. Менеджеры вежливые, всё объясняют понятно. Гарантию дали, документы все на руки выдали. Мотор работает отлично, расход даже меньше стал. Молодцы!",
  },
  {
    id: 27,
    name: "Николай",
    date: "20.10.2025",
    car: "Subaru XV",
    rating: 5,
    text: "Первый раз имел дело с контрактными запчастями. Переживал сильно, но тут всё объяснили, показали сертификаты. Движок пришёл в отличном состоянии, упакован профессионально. Поставили - завелась с пол тычка! Спасибо большое, теперь знаю куда обращаться!",
  },
  {
    id: 28,
    name: "Андрей К.",
    date: "12.10.2025",
    car: "Honda CR-Z",
    rating: 5,
    text: "Заказывал гибридный мотор для CR-Z. Это вообще редкость найти, а тут нашли! Причём в идеальном состоянии. Батарея держит отлично, электроника вся рабочая. Ребята профи, знают своё дело. Цена адекватная. Очень доволен покупкой!",
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

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      animatePistons();
      ticking = false;
    });
    ticking = true;
  }
});

animatePistons();
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

  const BOT_TOKEN = "8504954718:AAHQFIt_EPJ8VkJtcOaiz6X988MTRls0k8Q";
  const CHAT_ID = "-1003339414257";
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
