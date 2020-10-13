const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// inicializamos express
const app = express();
//settings para configurar numero de puerto
app.set('port', process.env.PORT || 4000);
//middlewares que se ejecutan antes de enviar o recibe datos
app.use(cors());
app.use(morgan('dev')) // sirve para ver informacion acerca de las peticiones que se realizan
app.use(express.urlencoded({ extended: false })); // para recibir datos sencillos (noimagenes,etc)
app.use(express.json());
//rutas
app.use(require('./src/routes/index.js'))





app.listen(app.get('port'), () => {
    console.log('Escuchando en el puerto ' + app.get('port'))
});