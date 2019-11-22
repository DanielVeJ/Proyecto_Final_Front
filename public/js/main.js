
$(function(){
    

    var listaUsersInChat=[];

    var salas={}; // posicion 0 es la general

    const socket=io();

    // obteniendon elementos del DOM
    const $msgForm=$("#mensajeform");
    const $msg=$('#mensaje');
    const $chat=$('#chat');
    const $listUsers=$('#usernames');
    const $btnOpciones=$('[href="#ventanaOpciones"]');

    
    // obteniendon elementos del Login
     
    const $userName=$("#username");
    const $btnJoin=$('#joinBtn');

    // obteniendon boton aceptar del panelCreacion
    const $usersSelects=$("#campoUsersPanelCreacion");
    const $btnAceptar=$("#btnAceptar");

    //miembro a enviar mensaje
    
    

    $btnAceptar.click(e=>{
        
       
        const inputs=document.querySelectorAll(".inputs");
        const nombreGrupo=document.querySelector("#nombreGrupo");

        let elementosCheckeados=0;
        
       // guardando usuario de grupos
        let usersInRoom=[];

        for(const input of inputs ){
              
            if(input.checked){
                //console.log(`usuario elegido ${input.dataset.name}`);
                usersInRoom.push(input.dataset.name);
                elementosCheckeados=elementosCheckeados+1;
            }

         }



        if(nombreGrupo.value!=""){

            if(elementosCheckeados!=0){
                
                let chats=document.querySelector("#chats");

                chats.innerHTML+=`<div id="divGroup" width="100%" ><img src="../src/icon_group.png" alt="${nombreGrupo.value}" height="42" width="42"><span id="nameGroup" data-miembros="${usersInRoom}">${nombreGrupo.value}</span><br/></div>`;
                
                   for (let i = 1; i < chats.children.length; i++) {
                        
                        chats.children[i].onclick=(e)=>{
                            
                             let camptextChat=document.querySelector('#chat');
                           
                             while (camptextChat.firstChild) {
                                
                                camptextChat.removeChild(camptextChat.firstChild);
                              }
                             
                             let icon_actual=document.querySelector("#icon_general img");
                             let text=document.querySelector("#icon_general span");
                             text.innerHTML=chats.children[i].children[1].innerHTML;
                             icon_actual.width="42";
                             icon_actual.src='../src/icon_group.png';
                             
                             camptextChat.innerHTML=(`<div><b>Usuarios en Chat :[${chats.children[i].children[1].dataset.miembros}]</div></b><br/>`);
                             
                       };
                       
                   }
                   

                //console.log(`usuarios en sala ${nombreGrupo.value}: ${usersInRoom}`);    

                nombreGrupo.value="";
                
            }else{
                alert("Selecciona por lo menos un usuario! intenta de nuevo.");
                nombreGrupo.value="";

            }
            
        }else {
           
            alert("debes asignar nombre al grupo! intenta de nuevo.");
            nombreGrupo.value="";
        }
    
        
    });

    $btnOpciones.click(e=>{

        if(listaUsersInChat.length != 1){
           
            let html='';
            for(const user of listaUsersInChat ){
                
                if(socket.nombreUsuario===user){
                   continue;
                }
                
                 html+=`<div width="100%"><span><img src="../src/icon_user.png" alt="${user}" height="42" width="42">${user}</span><input data-name="${user}" class="inputs" type="checkbox" id="cb" value="${socket.nombreUsuario}"></div><br/>`;
            }            

            $usersSelects.html(html);
       }


    });

   


    $btnJoin.click( e => {

       e.preventDefault();

       let name =$userName.val() ;

       if(name==""){
            name="Anonimo"
       }
     
       socket.emit('nuevo usuario',name, data =>{
            if(data){
               socket.nombreUsuario=name;
               $userName.hide();
               $btnJoin.hide();
               $('#contenedor').show();
            }else{

              alert(`El usuario con nombre: ${name} ya se encuentra en linea.`);

            }
            $userName.val('');
            let $campo=$('#chats');
            $campo.html(`<div id="divGroup" onclick="addEventChats('Chat General')" width="100%" ><img src="../src/icon_salaGeneral.png" alt="todos" height="42" width="55"><span >Chat General</span><br/></div>`);
            
       });
       console.log(`${name} se ha conectado`);

    });


    $msgForm.submit( e => {

        e.preventDefault();

        if(!$msg.val()==''){

            let camptextChat=document.querySelector('#chat');

            if(camptextChat.firstChild) {
                
                let texto=camptextChat.firstChild.firstChild.innerText;
                let indexIni=texto.indexOf("[")+1;
                let indexFin=texto.indexOf("]")-1;
                let textNuevo=texto.substr(indexIni,(indexFin+1)-indexIni);
                let arrayNames=textNuevo.split(",");
               
                socket.emit("enviar mensaje",$msg.val(),arrayNames);
                $msg.val('');

               
             }else{

                socket.emit("enviar mensaje",$msg.val(),undefined);
                 $msg.val('');

             }
          
           
        }
        
    });

    socket.on('nuevo mensaje',function(data){

          if(data.tipo){
             
            $chat.append('<b><--Mensaje Privado->'+ data.nick + '</b>:' + data.msg + '<br/>'); 
          }else{
            
            $chat.append('<b>'+ data.nick + '</b>:' + data.msg + '<br/>');
          }
        
    });

    socket.on('usuariosActivos', users => {
        console.log(users);
        
        listaUsersInChat=users;
        let html='';
        for(const user of users ){
          
           html+=`<div id="divUserConectados"><img src="../src/icon_user.png" alt="Smiley face" height="42" width="42"><span>${user}</span></div></p>`;
        }         
        $listUsers.html(html);
        
        
    });



})

// Funciones Globales
function addEventChats(titlegrupo){
    let icon_actual=document.querySelector("#icon_general img");
    let title=document.querySelector("#icon_general span");
    icon_actual.width="52";
    title.innerHTML=titlegrupo;
    icon_actual.src="../src/icon_salaGeneral.png";

    let camptextChat=document.querySelector('#chat');

                           
    while (camptextChat.firstChild) {
       
       camptextChat.removeChild(camptextChat.firstChild);
     }
  
    


};


//var socket;

// function connect(){

//     let campoName= document.querySelector("#username");
//     let btn= document.querySelector("#joinBtn");
//     let chat= document.querySelector(".container");
//     let form= document.querySelector("#mensajeform");
     
     
//     campoName.style.display="none";
//     btn.style.display = 'none';
//     chat.style.display = 'block';

    

//     // form.submit(e=>{
//     //     console.log("entriooooo");
//     //    e.preventDefault();
//     // });
    
  
//     if(socket){
//        socket.disconnect();
//     }

//  const username=document.querySelector("#username").value != '' && document.querySelector("#username").value  || 'Anonimo';
//  socket=io();

//  socket.on('ready',()=>{
//      socket.emit('parcharse',username);
//  }); 

//  socket.on('newUsuario',username=>{
//      alert(`${username} se ha conectado`);
    
//  });


//}
