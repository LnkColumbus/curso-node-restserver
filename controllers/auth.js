const bcryptjs = require('bcryptjs');
const { request, response } = require('express');

const User = require('../models/user');

const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async( req = request, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const { name, email, img } = await googleVerify( id_token );

        let user = await User.findOne({ email });
        if ( !user ) {
            // Crear usuario
            const data = {
                name,
                email,
                password: ':p',
                img,
                google: true
            }

            user = new User( data );
            await user.save()
        }

        // Si el usuario en BD
        if ( !user.state ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
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
        res.status(400).json({
            msg: 'Token de google no es válido'
        });
    }

}

module.exports = {
    login,
    googleSignIn
}