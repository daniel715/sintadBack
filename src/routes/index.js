const express = require('express');
const router = express.Router();
const pool = require('../../database');

var jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json({ limit: '10mb' }))

router.post('/login', (req, res) => {
    var username = req.body.user
    var password = req.body.password

    if (!(username === 'daniel' && password === 'daniel')) {
        res.status(401).send({
            error: 'usuario o contraseña inválidos'
        })
        return
    }

    var tokenData = {
        username: username
            // ANY DATA
    }

    var token = jwt.sign(tokenData, 'Secret Password', {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    })

    res.send({
        token
    })
})

router.get('/api/entidad', async(req, res) => {
    var token = req.headers['authorization']
    if (!token) {
        res.status(401).send({
            error: "Es necesario el token de autenticación"
        })
        return
    }
    token = token.replace('Bearer ', '')
    jwt.verify(token, 'Secret Password', async function(err, user) {
        if (err) {
            res.status(401).send({
                error: 'Token inválido'
            })
        } else {
            console.log("Token Valido");
            const data = await pool.query('select * from tb_entidad')
            console.log(data);
            res.send(data);
        }
    })

});

router.get('/api/tipoDocumento', async(req, res) => {
    var token = req.headers['authorization']
    if (!token) {
        res.status(401).send({
            error: "Es necesario el token de autenticación"
        })
        return
    }
    token = token.replace('Bearer ', '')
    jwt.verify(token, 'Secret Password', async function(err, user) {
        if (err) {
            res.status(401).send({
                error: 'Token inválido'
            })
        } else {
            console.log("Token Valido");
            const data = await pool.query('select * from tb_tipo_documento')
            console.log(data);
            res.send(data);
        }
    })

});

router.get('/api/tipoContribuyente', async(req, res) => {
    var token = req.headers['authorization']
    if (!token) {
        res.status(401).send({
            error: "Es necesario el token de autenticación"
        })
        return
    }
    token = token.replace('Bearer ', '')
    jwt.verify(token, 'Secret Password', async function(err, user) {
        if (err) {
            res.status(401).send({
                error: 'Token inválido'
            })
        } else {
            const data = await pool.query('select * from tb_tipo_contribuyente')
            console.log(data);
            res.send(data);
        }
    })

});

router.get('/api/eliminarEntidad', (req, res) => {
    res.send('eliminar entidad')
})


router.post('/api/eliminarEntidad', async(req, res) => {
    const id = req.body.id
    console.log(id)
    await pool.query('delete from tb_entidad where id_entidad = ?', [id])
    console.log("Registro con id", id, "eliminado")
});

router.post('/api/modificarTipoDocumento', async(req, res) => {
    console.log(req.body)
    const { id_tipo_documento, codigo, nombre, descripcion, estado } = req.body;

    const datos = {
        id_tipo_documento,
        codigo,
        nombre,
        descripcion,
        estado
    }
    console.log(datos)

    await pool.query(`
    UPDATE tb_tipo_documento
    SET ? 
    WHERE id_tipo_documento = ?`, [datos, req.body.id_actual]);
    res.json("actualizado");
    // await pool.query(`
    // UPDATE tb_entidad
    // SET id_tipo_documento ? 
    // WHERE id_tipo_documento = ?`, [datos.id_tipo_documento, req.body.id_actual]);
    // res.json("actualizado");
})


router.post('/api/modificarTipoContribuyente', async(req, res) => {
    console.log(req.body)
    const { id_tipo_contribuyente, nombre, estado } = req.body;

    const datos = {
        id_tipo_contribuyente,
        nombre,
        estado
    }
    console.log(datos)

    await pool.query(`
    UPDATE tb_tipo_contribuyente
    SET ? 
    WHERE id_tipo_contribuyente = ?`, [datos, req.body.idActual]);
    res.json("actualizado");
})

module.exports = router;