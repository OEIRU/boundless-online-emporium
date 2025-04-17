
db = db.getSiblingDB('wildstore');

// Создаем коллекции
db.createCollection('categories');
db.createCollection('products');
db.createCollection('users');
db.createCollection('orders');
db.createCollection('carts');

// Создаем индексы
db.products.createIndex({ "title": "text", "description": "text" });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "price": 1 });
db.products.createIndex({ "discount": 1 });
db.products.createIndex({ "colors.name": 1 });
db.products.createIndex({ "sizes": 1 });
db.products.createIndex({ "isActive": 1 });

// Добавляем базовые категории
const categories = [
  { name: 'Женщинам', slug: 'women', description: 'Женская одежда и аксессуары', icon: 'female' },
  { name: 'Мужчинам', slug: 'men', description: 'Мужская одежда и аксессуары', icon: 'male' },
  { name: 'Детям', slug: 'kids', description: 'Детская одежда и игрушки', icon: 'child' },
  { name: 'Дом', slug: 'home', description: 'Товары для дома', icon: 'home' },
  { name: 'Электроника', slug: 'electronics', description: 'Электроника и гаджеты', icon: 'smartphone' },
  { name: 'Красота', slug: 'beauty', description: 'Косметика и уход', icon: 'sparkles' },
  { name: 'Спорт', slug: 'sports', description: 'Спортивные товары', icon: 'dumbbell' },
  { name: 'Обувь', slug: 'shoes', description: 'Обувь для всех', icon: 'shoe' }
];

db.categories.insertMany(categories);

// Добавляем тестового админа
db.users.insertOne({
  email: 'admin@example.com',
  password: '$2b$10$rr5o0LX2ey8QA.Lw5qGvbeL1p8sIcwJGEwNmR5khECLnQDDC7FN2W', // password: 'admin123'
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Добавляем тестового пользователя
db.users.insertOne({
  email: 'user@example.com',
  password: '$2b$10$p6W33Vqk68T6vJ.T4MJmxOBqZiw4GfHiLRAN2XLdH0IxokZmLmG7y', // password: 'user123'
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Database initialized successfully!');
