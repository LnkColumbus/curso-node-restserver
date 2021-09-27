const { Router } = require('express');
const { body, check } = require('express-validator');

const router = Router();

const { loadFile, showImage, updateImageCloudinary } = require('../controllers/uploads');
const { validCollections } = require('../helpers/db-validators');
const { validateFields, validateUploadFile } = require('../middlewares');

router.get('/:coleccion/:id', [
    check('id', 'Debe ser un ID válido de Mongo').isMongoId(),
    check('coleccion').custom( col => validCollections( col, ['users', 'products'] ) ),
    validateFields
], showImage)

router.post('/', validateUploadFile, loadFile);

router.put('/:coleccion/:id', [
    validateUploadFile,
    check('id', 'Debe ser un ID válido de Mongo').isMongoId(),
    check('coleccion').custom( col => validCollections( col, ['users', 'products'] ) ),
    validateFields
], updateImageCloudinary);

module.exports = router;