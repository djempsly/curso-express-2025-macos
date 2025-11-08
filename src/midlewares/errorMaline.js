const errorMaline = (err, req, res, next) =>{
    const status = err.statusCode || 500
    const message = err.message

    console.error(`[ERROR] ${new Date().toISOString} - ${status} - ${message}`)

    if (err.stack) {

        console.error(err.stack)
        
    }

    res.status(statusCode).json({
        status: 'Error',
        status,
        message,
        ...(process.env.NODE_ENV2 === 'development' && {stack: err.stack})
    })
}


module.exports = errorMaline


