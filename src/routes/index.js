
const { Router} = require('express');
const authRouter = require('./auth')
const adminRouter = require('./admin')
const reservations = require('./reservation')
const appointments = require('./appointments')

const routes = Router();

routes.use('/auth', authRouter )
routes.use('/admin', adminRouter)
routes.use('/reservations', reservations)
routes.use('/users', appointments)


module.exports = routes




