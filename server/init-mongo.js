
db = db.getSiblingDB('cinemaverse');

// Создаем коллекции
db.createCollection('movies');
db.createCollection('users');
db.createCollection('lists');

// Создаем индексы для фильмов
db.movies.createIndex({ "title": "text", "originalTitle": "text", "overview": "text" });
db.movies.createIndex({ "releaseDate": -1 });
db.movies.createIndex({ "ratings.cinemaverse.value": -1 });
db.movies.createIndex({ "popularity": -1 });
db.movies.createIndex({ "watchCount": -1 });
db.movies.createIndex({ "genres": 1 });

// Создаем индексы для пользователей
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });

// Создаем индексы для списков
db.lists.createIndex({ "title": "text", "description": "text" });
db.lists.createIndex({ "creator": 1 });
db.lists.createIndex({ "tags": 1 });
db.lists.createIndex({ "likeCount": -1 });
db.lists.createIndex({ "createdAt": -1 });

// Популярные жанры для классификации фильмов
const genres = [
  "Боевик", "Приключения", "Анимация", "Комедия", "Криминал", 
  "Документальный", "Драма", "Семейный", "Фэнтези", "История", 
  "Ужасы", "Музыка", "Детектив", "Мелодрама", "Научная фантастика", 
  "Триллер", "Военный", "Вестерн"
];

// Добавляем тестового админа
db.users.insertOne({
  email: 'admin@cinemaverse.com',
  password: '$2b$10$rr5o0LX2ey8QA.Lw5qGvbeL1p8sIcwJGEwNmR5khECLnQDDC7FN2W', // password: 'admin123'
  username: 'cinemaster',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  bio: 'Администратор Cinemaverse - платформы для любителей кино',
  joinDate: new Date(),
  privacy: {
    profileVisibility: 'public',
    activityVisibility: 'public'
  },
  settings: {
    theme: 'dark',
    notifications: {
      email: {
        newFollower: true,
        comments: true,
        likes: true,
        recommendations: true
      },
      push: {
        newFollower: true,
        comments: true,
        likes: true
      }
    }
  },
  stats: {
    moviesWatched: 0,
    totalMinutesWatched: 0,
    listsCreated: 0,
    followers: 0,
    following: 0
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// Добавляем тестового пользователя
db.users.insertOne({
  email: 'user@cinemaverse.com',
  password: '$2b$10$p6W33Vqk68T6vJ.T4MJmxOBqZiw4GfHiLRAN2XLdH0IxokZmLmG7y', // password: 'user123'
  username: 'moviefan',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
  bio: 'Любитель кино и хороших историй',
  joinDate: new Date(),
  privacy: {
    profileVisibility: 'public',
    activityVisibility: 'public'
  },
  settings: {
    theme: 'system',
    notifications: {
      email: {
        newFollower: true,
        comments: true,
        likes: true,
        recommendations: true
      },
      push: {
        newFollower: true,
        comments: true,
        likes: true
      }
    }
  },
  stats: {
    moviesWatched: 0,
    totalMinutesWatched: 0,
    listsCreated: 0,
    followers: 0,
    following: 0
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// Добавляем несколько тестовых фильмов
const testMovies = [
  {
    title: "Начало",
    originalTitle: "Inception",
    tmdbId: 27205,
    imdbId: "tt1375666",
    overview: "Кобб – талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадет ценные секреты из глубин подсознания во время сна, когда человеческий разум наиболее уязвим.",
    tagline: "Твой разум - место преступления",
    posterPath: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdropPath: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    releaseDate: new Date("2010-07-16"),
    runtime: 148,
    status: "Released",
    genres: ["Боевик", "Научная фантастика", "Триллер"],
    director: "Кристофер Нолан",
    ratings: {
      tmdb: { value: 8.4, count: 30845 },
      imdb: { value: 8.8, count: 2159449 },
      metacritic: 74,
      rottenTomatoes: 87,
      cinemaverse: { value: 9.2, count: 124 }
    },
    popularity: 98.5,
    watchCount: 1352,
    likeCount: 876,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Властелин колец: Братство Кольца",
    originalTitle: "The Lord of the Rings: The Fellowship of the Ring",
    tmdbId: 120,
    imdbId: "tt0120737",
    overview: "Сказания о Средиземье — это хроника Великой войны за Кольцо, длившейся не одну тысячу лет. Тот, кто владел Кольцом, получал власть над всеми живыми тварями, но был обязан служить злу.",
    tagline: "Одно кольцо, чтобы править всеми",
    posterPath: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    backdropPath: "/vRQnzOn4HjIMX4LBq9nHhFXbsSu.jpg",
    releaseDate: new Date("2001-12-19"),
    runtime: 178,
    status: "Released",
    genres: ["Приключения", "Фэнтези", "Боевик"],
    director: "Питер Джексон",
    ratings: {
      tmdb: { value: 8.3, count: 21324 },
      imdb: { value: 8.8, count: 1708354 },
      metacritic: 92,
      rottenTomatoes: 91,
      cinemaverse: { value: 9.1, count: 89 }
    },
    popularity: 86.2,
    watchCount: 987,
    likeCount: 732,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Матрица",
    originalTitle: "The Matrix",
    tmdbId: 603,
    imdbId: "tt0133093",
    overview: "Жизнь Томаса Андерсона разделена на две части: днём он — самый обычный офисный работник, получающий нагоняи от начальства, а ночью превращается в хакера по имени Нео, и нет места в сети, куда он бы не смог проникнуть.",
    tagline: "Добро пожаловать в реальный мир",
    posterPath: "/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg",
    backdropPath: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    releaseDate: new Date("1999-03-31"),
    runtime: 136,
    status: "Released",
    genres: ["Боевик", "Научная фантастика"],
    director: "Лана Вачовски, Лилли Вачовски",
    ratings: {
      tmdb: { value: 8.2, count: 22933 },
      imdb: { value: 8.7, count: 1756345 },
      metacritic: 73,
      rottenTomatoes: 88,
      cinemaverse: { value: 9.0, count: 101 }
    },
    popularity: 82.7,
    watchCount: 1024,
    likeCount: 812,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.movies.insertMany(testMovies);

// Создаем тестовый список фильмов
const adminId = db.users.findOne({ username: 'cinemaster' })._id;

db.lists.insertOne({
  title: "Лучшие научно-фантастические фильмы",
  description: "Подборка самых захватывающих фильмов в жанре научной фантастики",
  creator: adminId,
  movies: [
    { movie: db.movies.findOne({ title: "Начало" })._id, addedAt: new Date() },
    { movie: db.movies.findOne({ title: "Матрица" })._id, addedAt: new Date() }
  ],
  visibility: "public",
  tags: ["sci-fi", "лучшее", "рекомендации"],
  likeCount: 15,
  commentCount: 3,
  viewCount: 187,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('База данных Cinemaverse инициализирована успешно!');
