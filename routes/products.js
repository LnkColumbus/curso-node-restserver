const { Router } = require('express');
const { body, check } = require('express-validator');

const router = Router();

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const {
    existsCategory,
    existsProduct,
    existsProductName
} = require('../helpers/db-validators');
const {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
} = require('../controllers/products');

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom( existsProduct ),
    validateFields
], getProduct);

router.post('/', [
    validateJWT,
    body('name', 'El nombre es obligatorio').notEmpty(),
    body('name').custom( existsProductName ),
    body('category', 'Debe ser un Id válido de Mongo').isMongoId(),
    body('category').custom( existsCategory ),
    validateFields
], createProduct);

router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom( existsProduct ),
    validateFields
], updateProduct);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom( existsProduct ),
    validateFields
], deleteProduct);

module.exports = router;