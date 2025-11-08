
const { Router} = require('express')
const { register, login} = require('../controllers/authController')
const authenticateToken = require('../midlewares/auth')

const router = Router()

router.post('/register', register)
router.post('/login', login)


router.get('/protected-route', authenticateToken, (req, res)=>{
    res.send('Acceso denegado, ruta protegida')
})


module.exports = router