const User = require('../models/user');
const Role = require('../models/role');

const isValidRole = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol "${ rol }" no está registrado en la BD`);
    }
}

const existsEmail = async( email ) => {
    const existeEmail = await User.findOne({ email });
    if (existeEmail) {
        throw new Error(`El email "${ email }" ya está registrado`);
    }
}

const existsUser = async( id ) => {
    const existUser = await User.findById( id );
    if (!existUser) {
        throw new Error(`El id "${id}" no existe`);
    }
}

module.exports = {
    isValidRole,
    existsEmail,
    existsUser
}