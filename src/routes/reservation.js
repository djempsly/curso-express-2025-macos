const { Router } = require('express');
const authenticateToken = require('../midlewares/auth');
const reservationController = require('../controllers/reservationController');
const router = Router();

router.post('/', authenticateToken, reservationController.createReservations)
router.get('/:id', authenticateToken, reservationController.getReservations)
router.put('/:id', authenticateToken, reservationController.updateReservations)
router.delete('/:id', authenticateToken, reservationController.deleteReservations)

module.exports = router