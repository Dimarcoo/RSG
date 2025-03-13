function homeClient (req, res){
    //res.render('admin/administrador');
    if(req.session.loggedin == true){
        res.redirect('/client');
        console.log('Boton presionado');
    }else{
        console.log('error al ir al home');
    }
    
}
function reglasclient (req, res){
    //res.render('reglas/reglasClient');
    res.redirect('/reglas');
}
function alertas (req, res){
    res.redirect('/alert');
}
function trafico (req, res){
    res.redirect('/trafic');
}
//FUNCION DISPOSITIVOS FUNCIONANDO CORRECTAMENTE GUARDADO EN BD
function dispositivo(req, res) {
    req.getConnection((err, conn) => {
        if (err) {
            console.error("Error de conexión:", err);
            return res.status(500).json({ error: "Error de conexión con la base de datos" });
        }
        
        //conn.query('SELECT * FROM dispositivos', (err, devices) => {
        conn.query('SELECT dispositivos.id, dispositivos.nombre_dispositivo, empresas.nombre_empresa FROM dispositivos JOIN empresas ON dispositivos.cod_empresa = empresas.id', (err, devices) => {    
            if (err) {
                console.error("Error al consultar la base de datos:", err);
                return res.status(500).json({ error: "Error al consultar la base de datos" });
            }
            
            // Renderiza directamente la vista con los datos
            res.render('dispositivos/dispositivos', { 
                devices, 
                nombre: req.session.nombre, 
                cargo: req.session.cargo 
            });
        });
    });
}//FIN DE FUNCION PARA VIISUALIZAR LOS DISPOSITIVOS



module.exports = {
    homeClient,
    reglasclient,  
    alertas, 
    trafico,
    dispositivo,
}