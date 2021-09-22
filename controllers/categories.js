const { request, response } = require('express');

const { Category } = require('../models');

const getCategories = async( req = request, res = response ) => {
    
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    try {
        const [ total, categories ] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(from))
                .limit(Number(limit))
                .populate('user', 'name')
        ]);

        res.json({
            total,
            categorias: categories
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }

}

const getCategory = async( req = request, res = response ) => {
    
    const id = req.params.id;

    try {
        const category = await Category.findOne({ _id: id, state: true })
                                .populate('user', 'name');

        if (!category) {
            return res.status(400).json({
                msg: 'La categoria no existe'
            });
        }

        res.json({
            categoria: category
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }
}

const createCategory = async( req = request, res = response ) => {

    const name = req.body.name.toUpperCase();

    try {
        // Generar la data a guardar
        const data = {
            name,
            user: req.user._id
        }

        const category = await new Category(data);
        category.save();

        res.status(201).json({
            categoria: category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hable con el administrador'
        });
    }
}

const updateCategory = async( req = request, res = response ) => {
    
    const id = req.params.id;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    try {
        const category = await Category.findByIdAndUpdate(id, data, { new: true });
        res.json({
            categoria: category
        });
    } catch (error) {
       console.log(error); 
       res.status(500).json({
           msg: 'Algo salió mal, hable con el administrador'
       });
    }
}

const deleteCategory = async( req = request, res = response ) => {
    
    const id = req.params.id;

    try {
        const category = await Category.findByIdAndUpdate(id, { state: false }, { new: true });
        res.json({
            categoria: category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }

}

module.exports = {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory
}