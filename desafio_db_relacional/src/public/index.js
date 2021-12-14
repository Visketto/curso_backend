const socket = io();
const admin = true;

//------------------------- Eventos de socket ---------------------------------//

//Lista de productos
socket.on('mostrarProductos', data=>{
    let productos = data;
    console.log(data);
    fetch('templates/productosTabla.handlebars').then(string=>string.text()).then(template=>{
        const plantillaProcesada = Handlebars.compile(template);
        const templateObject={
            productos:productos
        }
        const html = plantillaProcesada(templateObject);
        let div = document.getElementById('productosTabla');
        div.innerHTML=html;
    })
})

//Centro de mensajes
let emailChat = document.getElementById('emailChat');
let msjChat= document.getElementById('msjChat');
let chatButton= document.getElementById('chatButton');

function validarEmail(email){
    let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
}

chatButton.addEventListener('click',(e)=>{   
    e.preventDefault();
    if(emailChat.value===''){
        return alert('Ingresá un mail, por favor');
    }
    else if(validarEmail(emailChat.value)!= true){
        return alert('Ingresá el mail nuevamente');
    }
    else if(msjChat.value.trim()===''){
        return alert('Escribí un mensaje, por favor');
    }
    else{
        socket.emit('message',{emailChat:emailChat.value, message:msjChat.value});
    } 
});

socket.on('messagelog',data=>{
    let mensajesContenedor= document.getElementById('mensajes');
    let mensajes=data.map(m=>{
        return `<div><span><b>${m.message.emailChat}</b> [${m.time}]: ${m.message.message}</span></div>`
    }).join('');
    mensajesContenedor.innerHTML=mensajes;
})

//Envío de formulario para registrar producto
document.addEventListener('submit',enviarFormulario);
function enviarFormulario(event){
    event.preventDefault();
    let form= document.getElementById('prodForm');
    let data = new FormData(form);

    if(admin){
        fetch('/api/productos',{               
            method:'POST',
            body:data
        }).then(result=>{
            return result.json();
        }).then(json=>{
            Swal.fire({
                title:'Éxito',
                text:json.message,
                icon:'success',
                timer:2000,
            }).then(result=>{
                location.href='/'
            })
        })
    }else{
        fetch('/api/products')
          .then((result) => {
            return result.json();
          })
          .then((json) =>{
            Swal.fire({
              title: "Error",
              text: json.message,
              icon: "failed",
              timer: 2000
            }).then((result) =>{
              location.href = '/';
            });
        });
    };
};

document.getElementById("image").onchange = (e)=>{
    let read = new FileReader();
    read.onload = e =>{
        document.getElementById("preview").src = e.target.result;
    }
    read.readAsDataURL(e.target.files[0])
}
