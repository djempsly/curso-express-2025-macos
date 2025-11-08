const { PrismaClient } = require('../generated/prisma')
//import { PrismaClient } from '../generated/prisma'
//const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const bcryptjs = require('bcryptjs')


 
  
async function main() {
  // 1️⃣ Crear algunos TimeBlocks
  const timeBlock1 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2025-11-07T09:00:00'),
      endTime: new Date('2025-11-07T10:00:00')
    }
  })

  const timeBlock2 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2025-11-07T10:00:00'),
      endTime: new Date('2025-11-07T11:00:00')
    }
  })
   // --- Crear usuarios ---
  const hashPasswordAdmin = await bcryptjs.hash('admin1234', 10)
  const hashPasswordUser = await bcryptjs.hash('user1233', 10)


  // 2️⃣ Crear usuarios
  const user1 = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashPasswordAdmin,
      role: 'ADMIN'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: hashPasswordUser,
      role: 'USER'
    }
  })

  // 3️⃣ Crear citas (Appointments) relacionadas
  await prisma.appointment.create({
    data: {
      date: new Date('2025-11-07T09:00:00'),
      userID: user1.id,
      timeBlockId: timeBlock1.id
    }
  })

  await prisma.appointment.create({
    data: {
      date: new Date('2025-11-07T10:00:00'),
      userID: user2.id,
      timeBlockId: timeBlock2.id
    }
  })

  console.log('✅ Seed completado con Users, TimeBlocks y Appointments')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
