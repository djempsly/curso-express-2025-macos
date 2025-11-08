const { Router} = require('express')
const router = Router ()
const authentikcateToken = require('../midlewares/auth')
const appointmentController = require('../controllers/appointmentController')

router.get('/:id/appointment', 
    authentikcateToken, 
    appointmentController.getUserAppointment)

module.exports = router
