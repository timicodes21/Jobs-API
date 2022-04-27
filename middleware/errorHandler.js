const { CustomAPIError } = require('../errors/index')
const { StatusCodes } = require('http-status-codes')

const errorHandler = (err, req, res, next) => {

    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong, Try again later"
    }

    // if(err instanceof CustomAPIError){
    //     return res.status(err.statusCode).json({ msg: err.message })
    // }

    if(err.name === 'ValidationError'){
        customError.message = Object.values(err.errors).map(item => item.message).join(',');
        customError.statusCode = 400; 
    }

    if(err.name === 'CastError'){
        customError.message = `No item found with id : ${err.value}`
        customError.statusCode = 404;
    }

    if(err.code && err.code === 11000){
        customError.message = `Duplicate valued entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        customError.statusCode = 400
    }

    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err })
    return res.status(customError.statusCode).json({ msg: customError.message })
}

module.exports = errorHandler;