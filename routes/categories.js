const { Router } = require('express');
const { body, check } = require('express-validator');

const router = Router();

const {
    isAdminRole,
    validateFields,
    validateJWT
} = require('../middlewares');
const { existsCategory, existsCategoryName } = require('../helpers/db-validators');

const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categories');

// Obtener todas las categorias - publico
router.get('/', getCategories);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido de Mongo').isMongoId(),
    check('id').custom( existsCategory ),
    validateFields
], getCategory);

// Crear categoria - privado
router.post('/', [
    validateJWT,
    body('name', 'El nombre es obligatorio').notEmpty(),
    body('name').custom( existsCategoryName ),
    validateFields
], createCategory);

// Actualizar - privado
router.put('/:id', [
    validateJWT,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom( existsCategory ),
    body('name', 'El nombre de la categoria es obligatorio').notEmpty(),
    body('name').custom( existsCategoryName ),
    validateFields
], updateCategory);

// Borrar una categoria - Admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom( existsCategory ),
    validateFields
], deleteCategory);

module.exports = router;