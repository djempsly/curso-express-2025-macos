require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fs =require('fs')
const path = require('path')
const { PrismaClient} = require('./generated/prisma')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const loggerMidlewares = require('./midlewares/logger')
const errorHandler = require('./midlewares/errorHandler')
const authenticateUser = require('./midlewares/auth')


const readUserFile = path.join(__dirname, 'otrosdatos.json')

const app = express();
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}))
app.use(loggerMidlewares)
app.use(errorHandler)


const PORT = process.env.PORT || 3000
console.log(PORT)

app.get('/', (req, res)=>{
    res.send(`
        <h1> Curso de Express 2025</h1>
        <p> Estoy aprendiendo backend </p>
        `);
})

app.get('/users/:ID', (req, res)=>{
    const userId = req.params.ID

    res.send(`Esto es todo por ahora ${userId}`)

})

app.get('/search', (req, res)=>{
    const terms = req.query.termino || 'No especificado'
    const category = req.query.categoria || ' todas'

    res.send(`
            <p> Esto es el termino ${terms}</p>
            <p> Esta es la categoria ${category}</p>

        `)
})

app.post('/form', (req, res)=>{
    const name = req.body.nombre || 'Anonimo'
    const email = req.body.email || 'No proporcionado'

    res.json({
        message:'Datos recibidos',
        data:{
            name,
            email

        }
    })
})

app.post('/api/data/', (req, res)=>{
    const data = req.body

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({error:'Error al enviar los dato'})
        
    }
    res.status(201).json({
        message:'Datos JSON recibidos',
        data
    })
})

app.get('/users/', (req, res)=>{

    fs.readFile(readUserFile, 'utf-8', (err, data)=>{
        if (err) {
            return res.status(500).json({error:'Hubo un error'})
            
        }
        const users = JSON.parse(data)
        res.json(users)
    })


})

// aqui para crear un usuario nuevo

function validEmail(email){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
}


app.post('/users/', (req, res) =>{
    const newUsers = req.body
    const {name, email} = newUsers

    if (!newUsers || Object.keys(newUsers).length === 0) {
        return res.status(400).json({error: ' No se recibio datos'})
    }

    if (!name || name.length < 3) {
        return res.status(400).json({error: ' El nombre debe ser mas que tres caracteres'})   
    }

    if (!email || !validEmail(email)) {
        return res.status(400).json({error: ' Email Invalido'})
    }

    fs.readFile(readUserFile, 'utf-8', (err, data)=>{
        if (err) {
            return res.status(500).json({Error: 'Error al leer los datos'})
            
        }

        const user = JSON.parse(data)

         // Verificar si el usuario ya existe
        const exists = user.some(u => u.email === email);
        if (exists) {
            return res.status(409).json({message: 'No se puede agregar el usuario, ya existe'});
        }

         user.push(newUsers)

        fs.writeFile(readUserFile, JSON.stringify(user, null, 2), (err)=>{
        if (err) {
            return res.status(500).json({error: 'NO SE PUDO ESCRIBIR LOS ARCHIVOS'})
            
        }
        return res.status(200).json('datos actualizado correctamente')

        })
    })  
})


app.put('/users/:id', (req, res)=>{
    const nUser = parseInt(req.params.id, 10)
    const updatedUser = req.body 

    if (!updatedUser || Object.keys(nUser).length === 0) {
        return res.status(400).json({error: 'No se recibio datos'})
    }

    if (!updatedUser.name || updatedUser.name < 3) {
        return res.status(400).json({error: ' El nombre debe tener mas de 3 caracteres'})
        
    }

    if (!updatedUser.email || !validEmail(updatedUser.email)) {
        return res.status(400).json({error: ' email incorrecto'})
    }

    fs.readFile(readUserFile, 'utf-8', (err, data) =>{
        if (err) {
            return res.status(500).json({ error: 'No se pudo conectar con los datos'})
            
        }

        let user = JSON.parse(data)

        let userNew = user.findindex(user => user.id === nUser)

        fs.writeFile(readUserFile, JSON.stringify(userNew, null, 2), (err)=>{
            if (err) {
                return res.status(500).json({error: 'No se pudo escribir el archivo'})
                
            }

            return res.status(201).json({message: 'Usuario creado correctamen', userNew})
        })
    })
    
})


app.delete('/users/:id', (req, res)=>{
    const userId = parseInt(req.params.id, 10)

    fs.readFile(readUserFile, 'utf-8', (err, data)=>{
        if (err) {
            return res.status(500).json({error:'No se pudo conectar'})    
        }

        let users = JSON.parse(data)
        
           // Verificar si el usuario existe
        const exists = users.some(user => user.id === userId);
        if (!exists) {
            return res.status(404).json({message: 'No se puede eliminar, el usuario no existe'});
        }
      
        
        users = users.filter(user => user.id !== userId)

   

        fs.writeFile(readUserFile, JSON.stringify(users, null, 2), (err)=>{
            if (err) {
                return res.status(500).json({error: ' No se pudo escribir los datos'})
                
            }

            return res.status(200).json({message: 'Datos eliminado'})
        })
    })

})

//midleWares de prueba, hay que borrar antes de la produccion
app.get('/error', (req, res, next) =>{
    next(new Error('Error intencional Yes'))
})

app.get('/db-users', async(req, res)=>{
    try {
          const users = await prisma.user.findMany()
    res.json(users)
    } catch (error) {
        res.status(500).json({error : 'EN la base de datos'})
    }
  
})

app.get('/protected-route', authenticateUser, (req, res)=>{
    res.send('Acceso denegado, ruta protegida')
})

app.post('/register', async (req, res)=>{
    const {email, password, name} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data:{
            email,
            password: hashedPassword,
            name,
            rol: 'User'
        }
    })

    res.status(201).json({ message: 'Usuario creado correctamente'})
})

app.post('/login', async (req, res)=>{
    const {email, password} = req.body
    const user = await prisma.user.findUnique({where: {email}})

    if (!user) {
        return res.status(400).json({ error: ' Email o password incorrecto'})
        
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
         return res.status(400).json({ error: ' Email o password incorrecto'})
        
    }

   const token = jwt.sign({id: user.id, role: user.rol},process.env.JWT_SECRET, {expiresIn: '4h'})
   res.json({token})
})



app.listen(PORT, ()=>{
    console.log(`Servidor: http://localhost:${PORT}`);
})













