const { Router } = require('express');

const router = Router();
const { search } = require('../controllers/search');

router.get('/:coleccion/:termino', search)

module.exports = router;