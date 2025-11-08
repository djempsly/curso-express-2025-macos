const appointmentService = require('../services/appointmentService')


exports.getUserAppointment = async( req, res) =>{
    try {
        const userID = req.params.id
        const appointment = await appointmentService.getUserAppointment(userID)
        res.json(appointment)
        
    } catch (error) {
        res.status(500).json({ error: ' Error al obtener el historial de citas'})
    }

}



