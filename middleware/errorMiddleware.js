const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    console.error(err.message);

    let message = err.message;
    let errors = {};

    switch (err.name) {
        case 'SyntaxError':
            message = 'Invalid JSON provided in the request body.';
            break;

        case 'ValidationError':
            message = 'Validation failed.';
            Object.keys(err.errors).forEach(key => {
                errors[key] = err.errors[key].message;
            });
            break;

        case 'CastError':
            message = `Invalid ${err.kind} for field '${err.path}'.`;
            break;

        case 'MongoError':
            if (err.code === 11000) {
                message = 'Duplicate key error.';
            }
            break;

        default:
            if (statusCode === 500) {
                message = 'Something broke!';
            }
            break;
    }

    res.json({
        success: false,
        message: message,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
