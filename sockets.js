module.exports= function(io,connection){
  
  var users ={};

    io.on('connection', function(socket){
        
        socket.on('nuevo usuario', function(data,callback){

           if(data in users){
             callback(false);
           }else{
             callback(true);
             socket.nombreUsuario=data;
            
             users[socket.nombreUsuario]=socket;

             connection.query((`INSERT INTO users(name) VALUES ("${data}")`));

             io.sockets.emit('usuariosActivos',Object.keys(users));

            //  console.log(`socket usuario : ${socket.nombreUsuario} `);
            //  console.log(`${data} se ha conectado`);
            //  console.log(`lista de usuarios : ${users} `);
           }

          });

          socket.on('enviar mensaje', (mensaje,arrayNames) =>{

                  /// si es mensajes de chats
                if(arrayNames){
            
                  socket.emit('nuevo mensaje',{
                  msg:mensaje,
                  nick:socket.nombreUsuario,
                  tipo:false// true para el caso de chats
                  });

                  arrayNames.forEach(name => {
                      
                    
                     
                        if(name in users){
                            users[name].emit('nuevo mensaje',{
                            msg:mensaje,
                            nick:socket.nombreUsuario,
                            tipo:true // true para el caso de chats
                             });
                        }
                    

                  });

                  
                   
                } else{

                 /// si es mensajes general

                 io.sockets.emit('nuevo mensaje',{
                  msg:mensaje,
                  nick:socket.nombreUsuario,
                  tipo:false // false para el caso de general
                   });

                } 

             

               

          });


            socket.on('disconnect',data =>{
               if(!socket.nombreUsuario)return;

               connection.query(`DELETE FROM users WHERE name="${socket.nombreUsuario}"`); 
                delete users[socket.nombreUsuario];

               io.sockets.emit('usuariosActivos',Object.keys(users));
            });

    
    });

}