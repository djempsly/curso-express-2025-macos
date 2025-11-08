const { Router} = require('express')
const { createTimeBlocks, listReservations} = require('../controllers/adminController')
const router = Router()

const authenticateToken = require('../midlewares/auth')

router.post('/time-blocks', authenticateToken,  createTimeBlocks )
router.get('/reservations', authenticateToken,  listReservations)



module.exports = router