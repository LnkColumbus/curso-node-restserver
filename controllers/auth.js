const bcryptjs = require('bcryptjs');
const { request, response } = require('express');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');

const login = async( req = request, res = response ) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        // Verificar si el email existe
        if(!user) {
            return res.status(400).json({
                msg: 'Email / constraseña no son correctos - email'
            });
        }

        // Verificar si el usuario esta activo
        if (!user.state) {
            return res.status(400).json({
                msg: 'Email / constraseña no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password );
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Email / constraseña no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            usuario: user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salió mal, hable con el administrador'
        });
    }

}

module.exports = {
    login,
}