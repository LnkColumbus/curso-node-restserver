const { Router } = require('express');
const { body, check } = require('express-validator');

const router = Router();

const { existsEmail } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields'); 
const {
    login
} = require('../controllers/auth');

router.post('/login', [
    body('email', 'El correo es obligatorio').notEmpty(),
    body('email', 'Debe ser un correo válido').isEmail(),
    body('password', 'La contraseña es obligatoria').notEmpty(),
    validateFields
], login);

module.exports = router;