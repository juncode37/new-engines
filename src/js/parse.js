// Функция для парсинга одной страницы
function parseEngines() {
  const cards = document.querySelectorAll('.product-card');
  const engines = [];

  cards.forEach(card => {
    try {
      const productId = card.getAttribute('data-key');
      if (!productId) return;
      
      const link = card.querySelector('a[href^="/product/"]');
      const productUrl = link ? 'https://mysakura.ru' + link.getAttribute('href') : null;
      
      const priceElement = card.querySelector('[itemprop="price"]');
      const price = priceElement ? parseInt(priceElement.getAttribute('content')) : null;
      
      if (!price || price === 0) return;
      
      const imgElement = card.querySelector('.catalog-card-img');
      const mainImage = imgElement ? imgElement.getAttribute('src') : null;
      
      if (!mainImage || mainImage.includes('blank.png') || mainImage.includes('/imgs/')) return;
      
      const title = card.querySelector('[itemprop="name"]')?.textContent.trim() || 'Двигатель';
      
      const specs = card.querySelectorAll('.product-spec-row');
      let make = '';
      let model = '';
      let engineCode = '';
      let oem = '';
      
      specs.forEach(spec => {
        const label = spec.querySelector('.spec-label-text')?.textContent.trim();
        const value = spec.querySelector('.product-spec-value')?.textContent.trim();
        
        if (label === 'Авто' && value) {
          const parts = value.split(' ');
          make = parts[0] || '';
          model = parts.slice(1).join(' ') || '';
        }
        if (label === 'Двигатель' && value) {
          engineCode = value;
        }
        if (label === 'OEM' && value && value !== '--') {
          oem = value;
        }
      });
      
      if (!make || !model || !engineCode) return;
      
      const stockText = card.querySelector('.product-spec-value[title="Контракт"]') ? 'В наличии' : null;
      
      const engine = {
        source: 'mysakura',
        source_url: productUrl,
        product_id: parseInt(productId),
        title: title,
        make: make,
        model: model,
        year: null,
        engine_code: engineCode,
        engine_type: 'unknown',
        price: price,
        currency: 'RUB',
        stock_text: stockText,
        oem: oem || null,
        description: null,
        images: [mainImage]
      };
      
      engines.push(engine);
      
    } catch (error) {
      console.warn('Ошибка при обработке карточки:', error);
    }
  });

  return engines;
}

// Парсим текущую страницу
const enginesData = parseEngines();

console.log('✅ Найдено ВАЛИДНЫХ двигателей:', enginesData.length);
console.log('📊 Первые 3 товара:', enginesData.slice(0, 3));

// ФИНАЛЬНАЯ ВАЛИДАЦИЯ
const invalid = enginesData.filter(item => 
  !item.price || !item.make || !item.model || !item.engine_code || 
  !item.images[0] || item.images[0].includes('blank.png')
);

if (invalid.length > 0) {
  console.error('❌ НАЙДЕНЫ НЕВАЛИДНЫЕ ТОВАРЫ:', invalid);
} else {
  console.log('✅ ВСЕ ТОВАРЫ ВАЛИДНЫ!');
  
  // ФОРМАТ ДЛЯ ПРЯМОЙ ВСТАВКИ В МАССИВ
  const jsonString = JSON.stringify(enginesData, null, 2);
  
  // Убираем квадратные скобки массива, оставляем только объекты
  const objectsOnly = jsonString
    .replace(/^\[\n/, '')  // Убираем начало массива
    .replace(/\n\]$/, ''); // Убираем конец массива
  
  copy(objectsOnly);
  console.log('✅ Данные скопированы! Просто вставьте их в конец вашего массива через запятую');
  console.log('Пример: const enginesData = [ ...старые данные, СЮДА_ВСТАВИТЬ ];');
}