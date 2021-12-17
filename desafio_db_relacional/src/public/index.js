const socket = io();
const admin = true;

//------------------------- Eventos de socket ---------------------------------//

//Lista de productos
socket.on('mostrarProductos',data=>{
    let productos = data.payload;              //
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
socket.on("mensajes",(data) =>{
    let p = document.querySelector("#mensajes");
    console.log("Mensajes:",data);
    let mensajes = data.map((message) =>{
        return `<div><span><span>${message.username}</span> <span>[ ${message.created_at} ]</span> dice: <span>${message.message}</span></span></div>`;
        })
        .join("");
    p.innerHTML = mensajes;
});

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
