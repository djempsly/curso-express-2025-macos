const { PrismaClient} = require('../../generated/prisma')
const prisma = new PrismaClient()


const createTimeblockServices = async (startTime, endTime) =>{
    const newTimeBlock = await prisma.timeBlock.create({
        data:{
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        }
    })
    return newTimeBlock
}
   
const listReservationsServices = async () =>{
    const reservation = await prisma.appointment.findMany({
        include:{
            user: true,
            timeBlock: true
        }
    })

    return reservation
}

module.exports = { createTimeblockServices, listReservationsServices}