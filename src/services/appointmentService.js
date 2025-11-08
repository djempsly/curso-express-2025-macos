const { PrismaClient} = require('../../generated/prisma')
const prisma = new PrismaClient()

exports.getUserAppointment = async (userId) =>{

    try {
        const appointment = await prisma.appointment.findMany({
            where: { userID: parseInt(userId)},
            include:{ timeBlock: true}
        })
        return appointment
    } catch (error) {
        throw new Error('Error al obtener el historial de citas')
    }
}



