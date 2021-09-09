const { response, request } = require('express');

const getUsuarios = (req = request, res = response ) => {

    const { q, nombre = 'No name', apiKey, page = 1, limit } = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apiKey,
        page,
        limit
    });
}

const postUsuarios = (req, res = response ) => {

    const { nombre, edad } = req.body;

    res.status(201).json({
        msg: 'post API - controlador',
        nombre,
        edad
    });
}

const putUsuarios = (req, res = response ) => {

    const { id } = req.params;

    res.status(400).json({
        msg: 'put API - controlador',
        id
    });
}

const patchUsuarios = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const deleteUsuarios = (req, res) => {
    res.json({
        msg: 'delete API - controlador'
    });
}

module.exports = {
    getUsuarios,
    putUsuarios,
    postUsuarios,
    deleteUsuarios,
    patchUsuarios
}