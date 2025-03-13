function empresa(req, res) {
    req.getConnection((err, conn) => {
        if (err) {
            console.log("Error de conexión:", err);
            return res.status(500).json(err);
        }
        
        conn.query('SELECT * FROM empresas', (err, companies) => {
            if (err) {
                console.log("Error al consultar la base de datos:", err);
                return res.status(500).json(err);
            }
            
            // Redirige a la ruta '/empresas' solo si no hay datos de empresas en los parámetros de consulta
            if (!req.query.data) {
                const data = encodeURIComponent(JSON.stringify(companies));
                return res.redirect('/empresas?data=' + data);
            } else {
                // Si ya hay datos en los parámetros de consulta, renderiza la vista directamente
                res.redirect('empresas', { companies });
            }
        });
    });   
}
function homeAdmin (req, res){
    //res.render('admin/administrador');
    if(req.session.loggedin == true){
        res.redirect('/admin');
        console.log('Boton presionado');
    }else{
        console.log('error al ir al home');
    }
    
}


function reglasadmin (req, res){
    res.redirect('/reglas');
}

//funciones para crear las empresas en la base de datos
function storeCompany(req,res){
    const data = req.body;
    //Lineas de código para saber si una empresa ya esta creada en la BD
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM empresas WHERE nombre = ?', [data.nombre], (err, userdata) =>{
            if(userdata.length > 0){
                res.redirect('/empresas', { error: 'Error: Esta empresa ya existe !'});
            }else{
                req.getConnection((err, conn) => {
                    conn.query('INSERT INTO empresas SET ?', [data], (err, rows) => {
                        res.redirect('/empresas');
                    });
                });               
            }
        });
    });
}

function destroyCompany (req, res){
    const id = req.body.id;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM empresas WHERE id=?', [id], (err,rows)=>{
            res.redirect('/empresas');
        });
    });
}

//Funciones para los ataques
function ataque(req, res) {
    req.getConnection((err, conn) => {
        if (err) {
            console.log("Error de conexión:", err);
            return res.status(500).json(err);
        }
        
        conn.query('SELECT * FROM ataques', (err, attacks) => {
            if (err) {
                console.log("Error al consultar la base de datos:", err);
                return res.status(500).json(err);
            }
            
            // Redirige a la ruta '/empresas' solo si no hay datos de empresas en los parámetros de consulta
            if (!req.query.data) {
                const data = encodeURIComponent(JSON.stringify(attacks));
                return res.redirect('/ataques?data=' + data);
            } else {
                // Si ya hay datos en los parámetros de consulta, renderiza la vista directamente
                res.redirect('ataques', { attacks });
            }
        });
    });   
}

//funciones para guardar los ataques en la BD
function storeAttacks(req,res){
    const data = req.body;
    //Lineas de código para saber si una empresa ya esta creada en la BD
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM ataques WHERE nombre_ataque = ?', [data.nombre_ataque], (err, userdata) =>{
            if(userdata.length > 0){
                res.redirect('/ataques', { error: 'Error: Este ataque ya existe !'});
            }else{
                req.getConnection((err, conn) => {
                    conn.query('INSERT INTO ataques SET ?', [data], (err, rows) => {
                        res.redirect('/ataques');
                    });
                });               
            }
        });
    });
}

function destroyattacks (req, res){
    const id = req.body.id;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM ataques WHERE id_ataque=?', [id], (err,rows)=>{
            res.redirect('/ataques');
        });
    });
}
module.exports = {
    homeAdmin,
    reglasadmin,
    empresa,
    storeCompany,
    destroyCompany,
    ataque,
    storeAttacks,
    destroyattacks,
}
