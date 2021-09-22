const {
    Category,
    Role,
    User,
    Product
} = require('../models');

const isValidRole = async( rol = '' ) => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol "${ rol }" no está registrado en la BD`);
    }
}

const existsEmail = async( email ) => {
    const existEmail = await User.findOne({ email });
    if (existEmail) {
        throw new Error(`El email "${ email }" ya está registrado`);
    }
}

const existsUser = async( id ) => {
    const existUser = await User.findOne({ _id: id, state: true });
    if (!existUser) {
        throw new Error(`El id "${id}" no existe`);
    }
}

/**
 * CATEGORIAS
 */

const existsCategory = async( id ) => {
    const existCategory = await Category.findOne({ _id: id, state: true });
    if (!existCategory) {
        throw new Error(`El id "${id}" no existe`);
    }
}

const existsCategoryName = async( name ) => {
    const nombre = name.toUpperCase(); // Si se guarda el nombre en mayúsculas
    const existCategoryName = await Category.findOne({ name: nombre });
    if( existCategoryName ) {
        throw new Error(`La categoría con el nombre: "${name} está duplicado"`)
    }
}

/**
 * PRODUCTOS
 */

const existsProduct = async( id ) => {
    const existProduct = await Product.findOne({ _id: id, state: true });
    if (!existProduct) {
        throw new Error(`El id "${id}" no existe`);
    }
}

const existsProductName = async( name ) => {
    const nombre = name.toUpperCase(); // Si se guarda el nombre en mayúsculas
    const existProductName = await Product.findOne({ name: nombre });
    if (existProductName) {
        throw new Error(`El producto con ese nombre: "${name}" ya existe`);
    }
}

module.exports = {
    existsCategory,
    existsCategoryName,
    existsEmail,
    existsProduct,
    existsProductName,
    existsUser,
    isValidRole,
}