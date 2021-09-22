const { request, response } = require('express');
const { Product, Category } = require('../models');

const getProducts = async( req = request, res = response ) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    try {
        const [total, products ] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate('user', 'name')
                .populate('category', 'name')
                .skip(from)
                .limit(limit)
        ]);

        res.json({
            total,
            productos: products
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }
}

const getProduct = async( req = response, res = response ) => {

    const { id } = req.params;

    try {
        const product = await Product.findOne({ _id: id, state: true })
                                .populate('user', 'name')
                                .populate('category', 'name');

        res.json({
            producto: product
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }
}

const createProduct = async( req = request, res = response ) => {

    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    try {
        const product = await new Product(data);
        product.save();

        res.status(201).json({
            producto: product
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }
}

const updateProduct = async( req = request, res = response ) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    if (data.name) {
        data.name = data.name.toUpperCase();
    }
    data.user = req.user._id;

    try {
        const product = await Product.findByIdAndUpdate( id, data, { new: true });
        res.json({
            producto: product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }
}

const deleteProduct = async( req = request, res = response ) => {

    const { id } = req.params;

    try {
        const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true });
        res.json({
            producto: product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
}