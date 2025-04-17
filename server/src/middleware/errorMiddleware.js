
// Middleware для обработки ошибок API
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error('API Error:', err.message);
  
  res.status(statusCode).json({
    error: true,
    message: process.env.NODE_ENV === 'production' ? 'Внутренняя ошибка сервера' : err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

// Обработчик для несуществующих маршрутов API
const notFound = (req, res, next) => {
  const error = new Error(`Маршрут не найден - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
