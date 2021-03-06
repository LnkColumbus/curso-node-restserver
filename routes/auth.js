const { Router } = require('express');
const { body, check } = require('express-validator');

const router = Router();

const { validateFields } = require('../middlewares/validate-fields'); 
const {
    login, googleSignIn
} = require('../controllers/auth');

router.post('/login', [
    body('email', 'El correo es obligatorio').notEmpty(),
    body('email', 'Debe ser un correo válido').isEmail(),
    body('password', 'La contraseña es obligatoria').notEmpty(),
    validateFields
], login);

router.post('/google', [
    body('id_token', 'El id token es obligatorio').notEmpty(),
    validateFields
], googleSignIn);

module.exports = router;