require('dotenv').config()
const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const fileJson = path.join(__dirname, 'file.json')

const bodyParsed = require('body-parser')
app.use(bodyParsed.json())
app.use(express.urlencoded({extended:true}))

const PORT = process.env.PORT || 3000

app.get('/', (req, res)=>{
    res.send(`
        <h1> Página de express </h>
        <p> Hola, la pagina esta funcionando muy bien </p>
        `)
})

app.get('/users/:id', (req, res)=>{
    const usersId = req.params.id

    res.send(`
        <h2> EL usuario con el ID ${usersId} es asi </h2>
        `)
})

app.get('/search/', (req, res)=>{
    const terms = req.query.termino
    const category = req.query.categoria

    res.send(`
        <p> El termino es ${terms}</p>

        <p> La categoria es ${category} </p>

        
        `)
})

app.post('/form', (req, res)=>{
    const name = req.body.nombre
    const email = req.body.email

    res.json({
        message:'Datos enviados correctament',
        name, 
        email
    })
})

app.post('/api/data/', (req, res)=>{
    const data = req.body

    if (!data || Object.keys(data) === 0) {
        return res.status(400).json({error:'Hubo un error al enviar los datos'})
        
    }
    res.status(201).json({
        message:'Datos Enviado correctamente',
        data
    })

})


app.get('/users/', (req, res)=>{

    fs.readFile = (fileJson, 'utf-8', (err, data)=>{
        if (err) {
            return res.status(500).json({error: 'Hubo un error al leer los datos'})
        }

        const user =JSON.parse(data)
        res.json(user)
    })

})











app.listen(PORT, ()=>{
    console.log(`Corriendo: http://localhost:${PORT}`)
})
















