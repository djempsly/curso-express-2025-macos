
const { PrismaClient} = require('../../generated/prisma')
const prisma = new PrismaClient()


exports.createReservations = async (data) =>{
    const conflict = await prisma.appointment.findFirst({
        where : {
            date: data.date,
            timeBlockId: data.timeBlockId
        }
    })
    if (conflict) {
        throw new Error('Horario ocupado')
    }
    return prisma.appointment.create({data})
}

exports.getReservations = (id) =>{
    return prisma.appointment.findUnique({
        where: {id: parseInt(id, 10)}
    })
    
}

exports.updateReservations = async (data, id) =>{
    const conflict = await prisma.appointment.findFirst({
        where:{
            date: data.date,
            timeBlockId: data.timeBlockId,
            id: { not: parseInt(id, 10)}
        }
    })
    if (conflict) {
        throw new Error('Appointment unavailable or occupied')
    }

    return prisma.appointment.update({
        where: { id: parseInt(id, 10) },
        data: data
    })
}

exports.deleteReservations = (id) =>{
    return prisma.appointment.delete({
        where: { id: parseInt(id, 10)}
    })
}




