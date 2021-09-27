const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { request, response } = require('express');

const { User, Product } = require('../models');
const { uploadFile } = require('../helpers/upload-file');

const showImage = async( req = request, res = response ) => {

    const { id, coleccion } = req.params;
    let model;

    try {
        switch (coleccion) {
            case 'users':
                model = await User.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el ID ${id}`
                    });
                }
                break;
            
            case 'products':
                model = await Product.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: `No existe un producto con el ID ${ id }`
                    });
                }
                break;
        
            default:
                return res.status(500).json({
                    msg: `Esa colección ${coleccion} no esta validada`
                });
        }

        // Limpiar imagenes previas
        if ( model.img ) {
            // Hay que borrar la imagen del servidor
            const pathImg = path.join( __dirname, '../uploads', coleccion, model.img );
            if ( fs.existsSync(pathImg) ) {
                return res.sendFile( pathImg );
            }
        }

        const notFoundPath = path.join( __dirname, '../assets/no-image.jpg');
        res.sendFile( notFoundPath );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }

}

const loadFile = async( req = request, res = response ) => {

    try {
        // const name = await uploadFile(req.files, ['txt', 'md'], 'textos' );
        const name = await uploadFile(req.files, undefined, 'images' );
        res.status(201).json({
            nombre: name
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: error
        });
    }

};

const updateImage = async( req = request, res = response ) => {

    const { id, coleccion } = req.params;
    let model;

    try {

        switch (coleccion) {
            case 'users':
                model = await User.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el ID ${id}`
                    });
                }
                break;
            
            case 'products':
                model = await Product.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: `No existe un producto con el ID ${ id }`
                    });
                }
                break;
        
            default:
                return res.status(500).json({
                    msg: 'La colección no esta validada'
                });
        }

        // Limpiar imagenes previas
        if ( model.img ) {
            // Hay que borrar la imagen del servidor
            const pathImg = path.join( __dirname, '../uploads', coleccion, model.img );
            if ( fs.existsSync(pathImg) ) {
                fs.unlinkSync( pathImg );
            }
        }

        const nombre = await uploadFile( req.files, undefined, coleccion);
        model.img = nombre

        await model.save();

        res.json({
            modelo: model
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }
}

const updateImageCloudinary = async( req = request, res = response ) => {
    const { id, coleccion } = req.params;
    let model;

    try {

        switch (coleccion) {
            case 'users':
                model = await User.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el ID ${id}`
                    });
                }
                break;
            
            case 'products':
                model = await Product.findById(id);
                if (!model) {
                    return res.status(400).json({
                        msg: `No existe un producto con el ID ${ id }`
                    });
                }
                break;
        
            default:
                return res.status(500).json({
                    msg: 'La colección no esta validada'
                });
        }

        // Limpiar imagenes de cloudinary
        if ( model.img ) {
            const nameArr   = model.img.split('/');
            const name      = nameArr[ nameArr.length - 1 ];
            const [ public_id ] = name.split('.');

            cloudinary.uploader.destroy( public_id );
        }

        const { tempFilePath } = req.files.file;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

        model.img = secure_url;
        await model.save();

        res.json({
            modelo: model
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }
}

module.exports = {
    loadFile,
    showImage,
    updateImage,
    updateImageCloudinary,
}