const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');

const {
    Category,
    Product,
    User
} = require('../models');

const validCollections = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
];

const searchUsers = async( termino = '', res = response ) => {

    const isMongoID = isValidObjectId( termino );

    try {
        if (isMongoID) {
            const user = await User.findById(termino);
            return res.json({
                results: ( user ) ? [ user ] : []
            });
        }

        const regex = new RegExp( termino, 'i' );
        const users = await User.find({
            $or: [{ name: regex }, { email: regex }],
            $and: [{ state: true }]
        });
        res.json({
            results: users
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }

}

const searchCategories = async( termino = '', res = response ) => {

    const isMongoID = isValidObjectId( termino );

    try {
        if (isMongoID) {
            const category = await Category.findById(termino)
                                .populate('user', 'name');

            return res.json({
                results: (category) ? [category] : []
            });
        }

        const regex = RegExp( termino, 'i' );
        const categories = await Category.find({ name: regex, state: true })
                            .populate('user', 'name');
        
        res.json({
            results: categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }
}

const searchProducts = async( termino = '', res = response ) => {
    
    const isMongoID = isValidObjectId( termino );

    try {
        if (isMongoID) {
            const product = await Product.findById(termino)
                                .populate('user', 'name')
                                .populate('category', 'name');
            
            return res.json({
                results: (product) ? [product] : []
            });
        }

        const regex = RegExp( termino , 'i' );
        const products = await Product.find({ name: regex, state: true })
                            .populate('user', 'name')
                            .populate('category', 'name');

        res.json({
            results: products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }
}

const search = async( req = request, res = response ) => {

    const { coleccion, termino } = req.params;


        if (!validCollections.includes( coleccion)) {
            return res.status(400).json({
                msg: `Las colecciones permitidas son: ${ validCollections }`
            });
        }

        switch (coleccion) {
            case 'categorias': 
                searchCategories( termino, res );
                break;
            case 'productos': 
                searchProducts( termino, res );
                break;
            case 'usuarios': 
                searchUsers( termino, res );
                break;
            default:
                res.status(500).json({
                    msg: 'Esta busqueda no esta disponible todavía'
                });
                break;
        }
}

module.exports = {
    search
}