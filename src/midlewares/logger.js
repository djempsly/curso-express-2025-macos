
const loggermidlewares = (req, res, next)=>{
const timestamp = new Date().toLocaleString();
//en esta  parte quiero que el midleware me verifique la hoa, el metodo, el ip y la url
console.log(`[${timestamp} ${req.method}  ${req.url}, IP ${req.ip}]`)

const start = Date.now()

res.on('finish', ()=>{
    const duration = Date.now() - start

    console.log(`[${timestamp}, ${res.statusCode}, ${duration}ms]`)

})
next()
}

module.exports = loggermidlewares





