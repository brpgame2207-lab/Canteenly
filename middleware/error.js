const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err.stack);

  if (err.code === '22P02') {
    const message = 'Resource not found';
    error = new Error(message);
    error.statusCode = 404;
  }

  if (err.code === '23505') {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
