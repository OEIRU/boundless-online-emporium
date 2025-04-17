
export const siteMeta = {
  name: 'ВайлдСтор',
  description: 'Интернет-магазин с широким ассортиментом товаров для всей семьи',
  url: 'https://wildstore.ru',
  socialImage: '/images/social-card.jpg',
  locale: 'ru-RU',
  themeColor: '#6b46c1',
  version: '1.0.0',
  contactEmail: 'info@wildstore.ru',
  contactPhone: '+7 (800) 123-45-67',
  address: 'г. Москва, ул. Примерная, 123',
  socialLinks: {
    vk: 'https://vk.com/wildstore',
    telegram: 'https://t.me/wildstore',
    instagram: 'https://instagram.com/wildstore'
  }
};

export const categories = [
  { id: 'women', name: 'Женщинам', slug: 'women' },
  { id: 'men', name: 'Мужчинам', slug: 'men' },
  { id: 'kids', name: 'Детям', slug: 'kids' },
  { id: 'home', name: 'Дом', slug: 'home' },
  { id: 'electronics', name: 'Электроника', slug: 'electronics' },
  { id: 'beauty', name: 'Красота', slug: 'beauty' },
  { id: 'sports', name: 'Спорт', slug: 'sports' },
  { id: 'shoes', name: 'Обувь', slug: 'shoes' }
];

export const siteConfig = {
  productsPerPage: 12,
  maxFeaturedProducts: 8,
  minPasswordLength: 8,
  maxFileUploadSize: 5 * 1024 * 1024, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  deliveryOptions: [
    { id: 'standard', name: 'Стандартная доставка', price: 300, days: '3-5' },
    { id: 'express', name: 'Экспресс доставка', price: 500, days: '1-2' },
    { id: 'pickup', name: 'Самовывоз', price: 0, days: '1-3' }
  ],
  paymentMethods: [
    { id: 'card', name: 'Банковская карта' },
    { id: 'cash', name: 'Наличными при получении' },
    { id: 'online', name: 'Онлайн платеж' }
  ]
};
