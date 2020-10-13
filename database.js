const mysql = require('mysql');
const { database } = require('./keys'); // credenciales de la bd
const { promisify } = require('util'); //este modulo sirve para poder utilizar promesas en las querys a la base de datos

const pool = mysql.createPool(database);

pool.getConnection((err, con) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') // la bd no se esta ejecutando
            console.error('CONEXION CON BD CERRADA')
        if (err.code === 'ER_CON_COUNT_ERROR')
            console.error('DATABASE HAS TOO MANY CONNECTIONS') // la bd tiene muchas conexiones
        if (err.code === 'ECONNREFUSED')
            console.err('DATABASE CONNECTION WAS REFUSED') // conexion rechazada tal vez por malas credenciales
    }

    if (con) {
        con.release();
        console.log('Base de datos conectada');
        return;
    }
});
//ahora puede utilizar promesas con promisify
pool.query = promisify(pool.query);

module.exports = pool;