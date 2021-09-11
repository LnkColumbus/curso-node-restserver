const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const getUsers = async(req = request, res = response ) => {

    const { limit = 5, from = 0 } = req.query;

    try {
        const [ total, users ] = await Promise.all([
            User.countDocuments({ state: true }),
            User.find({ state: true })
                .skip(Number(from))
                .limit(Number(limit))
        ]);

        res.json({
            total,
            usuarios: users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }
    
}

const postUsers = async(req, res = response ) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    try {        
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync( password, salt );

        // Guardar en BD
        await user.save();
        
        res.status(201).json({
            usuario: user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, por favor hablar con el administrador'
        });
    }
}

const putUsers = async(req, res = response ) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...rest } = req.body;

    try {

        //TODO: validar contra la BD
        if ( password ) {
            const salt = bcryptjs.genSaltSync();
            rest.password = bcryptjs.hashSync( password, salt );
        }

        const user = await User.findByIdAndUpdate(id, rest, { new: true });
        
        res.json({
            usuario: user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        });
    }
}

const patchUsers = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const deleteUsers = async(req = request, res = response) => {

    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(id, { state: false }, { new: true });
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hablar con el administrador'
        })
    }
    
}

module.exports = {
    getUsers,
    putUsers,
    postUsers,
    deleteUsers,
    patchUsers
}