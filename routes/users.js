const { Router } = require('express');
const { body, check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { isValidRole, existsEmail, existsUser } = require('../helpers/db-validators');

const {
    getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers
} = require('../controllers/users');

const router = Router();

router.get('/', getUsers);

router.post('/', [
    body('name', 'El nombre es obligatorio').notEmpty(),
    body('email', 'El correo es obligatorio').notEmpty(),
    body('email', 'El correo no es válido').isEmail(),
    body('email').custom( existsEmail ),
    body('password', 'La contraseña es obligatoria').notEmpty(),
    body('password', 'La contraseña debe de ser de más de 6 letras').isLength({ min: 6 }),
    body('role').custom( isValidRole ),
    validateFields
], postUsers);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsUser ),
    body('role').custom( isValidRole ),
    validateFields
], putUsers);

router.patch('/', patchUsers);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsUser ),
    validateFields
], deleteUsers);

module.exports = router;