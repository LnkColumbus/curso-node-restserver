const validateFields        = require('../middlewares/validate-fields');
const validateUploadFile    = require('./validate-file');
const validateJWT           = require('../middlewares/validate-jwt');
const validateRoles         = require('../middlewares/validate-roles');

module.exports = {
    ...validateFields,
    ...validateUploadFile,
    ...validateJWT,
    ...validateRoles
}