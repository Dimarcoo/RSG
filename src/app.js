const express = require('express');
const {engine} = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const { redirect } = require('express/lib/response');
const path = require('path');
const readline = require('readline');

//Constatntes de las rutas a usar en todo el proyecto
const loginRoutes = require('./routes/login');
const administradorRoutes = require('./routes/administrador');
const clienteRoutes = require('./routes/cliente');
//============================================================


const app = express();
//para ver los estilos
app.use(express.static('src'));

app.set('port', 4000);
app.set('view engine', 'hbs');

app.set('views', path.join(__dirname , 'views'));
app.engine('.hbs', engine({
    extname: '.hbs',
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',
    database: 'risksmartguard'
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.listen(app.get('port'), () => {
    console.log('Listening on port ', app.get('port'))
});
//Para usar las rutas en todo el proyecto
app.use('/', loginRoutes);
app.use('/', administradorRoutes);
app.use('/', clienteRoutes);
//===================================== 

app.get('/', (req, res) => {
    if(req.session.loggedin == true){
        //console.log('Hola', {nombre: req.session.nombre});
    }else{
        res.redirect('/login');
    }
});
//administrador
app.get('/admin', (req, res) => {
    if(req.session.loggedin == true){
        console.log('Hola', {nombre: req.session.nombre});   
        console.log('Cargo', {cargo: req.session.cargo}); 
        res.render('admin/administrador', {nombre: req.session.nombre, cargo:req.session.cargo}); 
    }else{
        res.redirect('/login');
    }
});
//empresas administrador
app.get('/empresas', (req, res) => {
    if(req.session.loggedin == true){
        const data = req.query.data;
        if(!data){
            //Si se registra con exito una empresa, esta me redirige a la interfaz de administrador
            return res.redirect('/admin');
        }
        const companies = JSON.parse(decodeURIComponent(data));
        res.render('empresas/empresas', {nombre: req.session.nombre, cargo: req.session.cargo, companies}); 
    }else{
        res.redirect('/login');
    }
});//Fin empresas administrador

//ataques administrador
app.get('/ataques', (req, res) => {
    if(req.session.loggedin == true){
        const data = req.query.data;
        if(!data){
            //Si se registra con exito una empresa, esta me redirige a la interfaz de administrador
            return res.redirect('/admin');
        }
        const attacks = JSON.parse(decodeURIComponent(data));
        res.render('ataques/ataques', {nombre: req.session.nombre, cargo: req.session.cargo, attacks}); 
    }else{
        res.redirect('/login');
    }
});//Fin ataques

//Leer archivos de reglas suricata
const fs = require('fs'); // Importa el módulo 'fs' para manejar archivos
// Cargar y mostrar las reglas
app.get('/reglas', (req, res) => {
    if (req.session.loggedin == true) {
        // Ruta completa del archivo de reglas
        const rutaArchivo = "C:\\Users\\User\\Desktop\\Aplicativo\\Archivos\\suricata.rules";
        //C:\Users\User\Desktop\Aplicativo\Archivos

        // Lee el archivo de reglas
        fs.readFile(rutaArchivo, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al leer el archivo de reglas');
                return;
            }
            // Divide el contenido del archivo en líneas
            const lineas = data.split('\n');
            // Renderiza la página 'reglasAdmin' con los datos del archivo en una tabla
            res.render('reglas/reglasAdmin', { nombre: req.session.nombre, cargo: req.session.cargo, reglas: lineas });
        });
    } else {
        res.redirect('/admin');
    }
});


//============================================CLIENTE===================================================
app.get('/client', (req, res) => {
    if(req.session.loggedin == true){
        console.log('Hola Cliente', {nombre: req.session.nombre});   
        res.render('client/cliente', {nombre: req.session.nombre, cargo: req.session.cargo}); 
    }else{
        res.redirect('/login');
    }
});
//cargar y mostrar el trafíco
app.get('/trafic', (req, res) => {
    if (req.session.loggedin == true) {
        // Ruta completa del archivo de reglas
        const rutaArchivo = "C:\\Users\\User\\Desktop\\Aplicativo\\Archivos\\eve.json";
        //Cambios hechos 12/11/2024
        //Función que limpia lineas mal formateadas y asegura una estructura solida en JSON
        function limpiarJSON (data) {
            const lineas = data.split('\n');
            const lineasvalidas = [];

            for (const linea of lineas) {
                try {
                    JSON.parse(linea);
                    lineasvalidas.push(linea.trim());
                } catch (error) {
                    console.error('Linea mal formateada ignorada')
                }
            }
            return `[${lineasvalidas.join(',')}]`;
        }//Fin de limpieza JSON

        //Función de validacion de IPv4
        function validarIPv4(ip){
            return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
        }//Fin de la función IPv4

        fs.readFile(rutaArchivo, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error al leer el archivo eve.json');
            }

            try {
                const limpiardatos = limpiarJSON(data);
                const eventos = JSON.parse(limpiardatos);
                const eventosProcesados = eventos
                    .map(evento => {
                        const inPackets = evento.stats?.capture?.in_packes ?? 'N/A';
                        const outPackets = evento.stats?.capture?.out_packes ?? 'N/A';
                        const duration = evento.stats?.capture?.age ?? 'N/A';
                        
                        console.log('Evento: ', {
                            src_ip: evento.src_ip,
                            dest_ip: evento.dest_ip,
                            inPackets,
                            outPackets,
                            duration
                        });

                        return {
                            timestamp: evento.timestamp,
                            flow_id: evento.flow_id,
                            src_ip: validarIPv4(evento.src_ip) ? evento.src_ip: 'N/A',
                            dest_ip: validarIPv4(evento.dest_ip) ? evento.dest_ip : 'N/A',
                            src_port: evento.src_port,
                            dest_port: evento.dest_port,
                            proto: evento.proto,
                            alert: evento.alert ? evento.alert.signature : 'N/A',
                            in_packets: inPackets, // Paquetes de entrada
                            out_packets: outPackets, // Paquetes de salida
                            duration: duration // Duración
                        };
                    })
                    .filter(evento => evento.src_ip !== 'N/A' && evento.dest_ip !== 'N/A');
                res.render('trafic/trafico', {nombre: req.session.nombre, cargo: req.session.cargo, eventos: eventosProcesados});
            } catch (error) {
                console.error('Error al procesar el JSON:', error);
                return res.status(500).send('Error al procesar el JSON');
            }
        });
    } else {
        res.redirect('/admin');
    }
});
//alertas cliente
app.get('/alert', (req, res) => {
    if(req.session.loggedin == true){
        console.log('Interfaz Alertas', {nombre: req.session.nombre});   
        res.render('alert/alertas', {nombre: req.session.nombre, cargo: req.session.cargo}); 
    }else{
        res.redirect('/login');
    }
});

app.get('/dispositivos', (req, res) => {
    if (req.session.loggedin) {
        dispositivo(req, res);
    } else {
        res.redirect('/login');
    }
});

app.get('/alertas', (req, res) => {
    if(req.session.loggedin){
        alertas(req, res);
    }else {
        res.redirect('/login')
    }
})
//=======================================================HELPERS=============================================
// Definir el helper para comparación de igualdad en
const handlebars = require('handlebars');
const { alertas } = require('./controllers/ClientController');

// Helper para comparar si dos valores son iguales en el cargo
handlebars.registerHelper('isEqual', function(value1, value2, options) {
    return value1 === value2 ? options.fn(this) : options.inverse(this);
});
//Para predecir los ataques
const predecirtAttack = (data) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', ['ruta/al/script.py']);
        let result = '';

        pythonProcess.stdin.write(JSON.stringify(data));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (output) => {
            result += output.toString();
        });

        pythonProcess.stderr.on('data', (error) => {
            reject(error.toString());
        });

        pythonProcess.on('close', () => {
            resolve(JSON.parse(result));
        });
    });
};

const validacionteAttack = async (attackType) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ataques WHERE tipo = ?', [attackType]);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return { mensaje: 'Ataque no encontrado' };
        }
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        throw error;
    }
};

module.exports = { validateAttack };

const { validateAttack } = require('./validateAttack');

app.get('/prediccion', async (req, res) => {
    try {
        const data = processEveFile();
        const prediction = await predictAttack(data);
        const attackInfo = await validateAttack(prediction.attackType);
        res.render('index', { prediction, attackInfo });
    } catch (error) {
        res.status(500).send('Error en el procesamiento');
    }
});
