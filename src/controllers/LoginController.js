const bcrypt = require('bcrypt');

//Para mostrar el formulario de validacion con Login
function login(req, res){
    if(req.session.loggedin != true){
        res.render('login/login');
        console.log('Sesion no iniciada');
    }else{
        console.log('Sesion iniciada');
    }
}
//funcion para la autenticacion de prueba loquera
function authUser(req, res){
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE usuario = ? ', [data.usuario], (err, userdata) => {
            if(userdata.length > 0){
                const tipouser = userdata [0];
                userdata.forEach(element => {
                    bcrypt.compare(data.contraseña, element.contraseña, (err, isMatch) => {
                        if(isMatch){
                            if(tipouser.id_cargo==1){
                                console.log('Administrador en linea');
                                req.session.loggedin = true;
                                req.session.nombre = element.nombre;
                                req.session.cargo = element.id_cargo;
                                console.log('Administrador: ',element.nombre, element.apellido, element.id_cargo);
                                res.redirect('/admin');
                            }else if(tipouser.id_cargo==2){
                                console.log('Cliente en linea');
                                req.session.loggedin = true;
                                req.session.nombre = element.nombre;
                                req.session.cargo = element.id_cargo;
                                console.log('Cliente: ',element.nombre, element.apellido, element.id_cargo);
                                res.redirect('/client');
                            }
                        }else{
                            res.render('login/login', {error: 'Error: Contraseña incorrecta !'});                            
                        }
                    });
                });
            }else{
                res.render('login/login', {error: 'Error: El usuario no existe'});
            }
        });
    });
}
//Para mostrar el formulario de validacion con Login
function register(req, res){
    if(req.session.loggedin != true){
        res.render('login/register');
    }
}
//funciones para crear los usuarios en la base de datos
function storeUser(req,res){
    const data = req.body;
    //Lineas de código para saber si un usuario ya esta creado en la BD
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM usuarios WHERE usuario = ?', [data.usuario], (err, userdata) =>{
            if(userdata.length > 0){
                res.render('login/register', { error: 'Error: El usuario ya existe !'});
            }else{
                //contraseña encriptada
                bcrypt.hash(data.contraseña, 12).then(hash => {
                    data.contraseña = hash;
                    req.getConnection((err, conn) =>{
                        conn.query('INSERT INTO usuarios SET ?', [data], (err, rows) => { //insertar datos en la BD en la tabla usuarios
                            res.redirect('/');//ruta raiz
                        });
                    });
                });                
            }
        });
    });
}

function logout(req, res){
    if(req.session.loggedin == true ){
        req.session.destroy();
        console.log('Sesion finalizada');
    }
    res.redirect('/login');
}

module.exports = {
    login,
    register,
    storeUser,
    authUser,
    logout,
}