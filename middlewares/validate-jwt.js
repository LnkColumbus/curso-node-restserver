const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }
    
    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // Leer el usuario que corresponde al uid
        const user = await User.findById(uid);

        // Verificar que el usuario exista en la BD
        if ( !user ) {
            return res.status(404).json({
                msg: 'Token no válido, usuario no existe en BD'
            });
        }

        // Verificar si el uid tiene estado en true
        if( !user.state ) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

}

module.exports = {
    validateJWT
}