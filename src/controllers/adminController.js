const {createTimeblockServices,
     listReservationsServices } = require('../services/adminService')


const createTimeBlocks = async (req, res)=>{
    const {startTime, endTime} = req.body
    
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({error : ' Access denied'})
    }

try {
    const newTimeBlock = await createTimeblockServices(startTime, endTime)
    res.status(200).json(newTimeBlock)
} catch (error) {
    res.status(500).json({ error: 'Error creating the time blocks', error})
    
}
}


const listReservations = async (req, res) =>{

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({error : ' Access denied'})
    }

    try {
        const reservation = listReservationsServices()
        res.json(reservation)
    } catch (error) {
         res.status(500).json({ error: 'Error fecthing the reservation'})
    }

}


module.exports = {createTimeBlocks, listReservations}







