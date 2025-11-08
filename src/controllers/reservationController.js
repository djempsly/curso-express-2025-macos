const reservationService = require('../services/reservationService')

exports.createReservations = async (req, res) =>{
    try {
        const reservation = await reservationService.createReservations(req.body)
        res.status(201).json(reservation)
        
    } catch (error) {
        res.status(400).json({ error: error.message})
        
    }
}

exports.getReservations = async (req, res) =>{
    try {
        const reservation = await reservationService.getReservations(req.params.id )
        if (!reservation) {
            return res.status(404).json({ error: ' Reservation not found'})
        }
        res.status(200).json(reservation)
    } catch (error) {
          res.status(400).json({ error: error.message})
    }
}

exports.updateReservations = async (req, res) =>{
    try {
        const reservation = await reservationService.updateReservations(req.body,
            req.params.id,
            
        )
        if (!reservation) {
            return res.status(404).json({ error: ' Reservation not found'})
        }
        if (!req.params.id || isNaN(req.params.id)) {
  return res.status(400).json({ error: 'Invalid reservation ID' });
}

        res.status(200).json(reservation)
    } catch (error) {
          res.status(400).json({ error: error.message})
    }
}

exports.deleteReservations = async (req, res) =>{
    try {
        const resultado = await reservationService.deleteReservations(req.params.id)
        if (!resultado) {
            return res.status(404).json({ error: 'Reservation not found'})
        }
        res.status(200).json(resultado)
    } catch (error) {
         res.status(400).json({ error: error.message})
    }
}



