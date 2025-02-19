//src/middlewares/errorHandler.js
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Indica que es un error controlado
    }
}
module.exports = (err, req, res, next) => {
    console.error(err.stack);

    let { statusCode, message } = err;

    // Si no tiene un código de estado, usa 500
    if (!statusCode) statusCode = 500;

    // Manejo de errores específicos de Mongoose
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(el => el.message).join(', ');
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    if (err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate key error';
    }

    res.status(statusCode).json({
        status: 'error',
        message
    });
};

// Exportar la clase AppError para poder lanzar errores personalizados en los controladores
module.exports.AppError = AppError;