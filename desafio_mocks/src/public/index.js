const socket = io();
const admin = true;

//------------------------- Eventos de socket ---------------------------------//

//Lista de productos
socket.on('mostrarProductos',data=>{
    let productos = data.payload;         //PAYLOAD       
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
let emailInput = document.getElementById('email')
let email = ''
emailInput.addEventListener('keyup',e =>{
  if(e.target.value) email = e.target.value
})

let firstNameInput = document.getElementById('firstName')
let firstName = ''
firstNameInput.addEventListener('keyup',e =>{
  if(e.target.value) firstName = e.target.value
})

let lastNameInput = document.getElementById('lastName')
let lastName = ''
lastNameInput.addEventListener('keyup',e =>{
  if(e.target.value) lastName = e.target.value
})

let ageInput = document.getElementById('age')
let age = ''
ageInput.addEventListener('keyup',e =>{
  if(e.target.value) age = e.target.value
})

let aliasInput = document.getElementById('alias')
let alias = ''
aliasInput.addEventListener('keyup',e =>{
  if(e.target.value) alias = e.target.value
})

let avatarInput = document.getElementById('avatar')
let avatar = ''
avatarInput.addEventListener('keyup',e =>{
  if(e.target.value) avatar = e.target.value
})

let messageInput = document.getElementById('message')
let message = ''
messageInput.addEventListener('keyup',e =>{
  if(e.target.value) message = e.target.value
})

document.addEventListener('submit',sendForm)
function sendForm(e){
    e.preventDefault()
    let data ={
        id:email,
        firstName:firstName,
        lastName:lastName,
        age:age,
        alias:alias,
        avatar:avatar,
        message:message
    }

    fetch('/api/chats',{
            method:'POST',
            body:JSON.stringify(data),
            headers:{
            'Content-Type':'application/json'
            }
    }).then(result =>{
        return result.json()
    }).then(json =>{
        socket.emit('chats')
    }).then(result =>{
        document.getElementById('chatForm').reset();
    });
}

socket.on('chats',data =>{
    let result = data
    let originalData = {"id":"messages","chats":JSON.parse(JSON.stringify(result))}

    let author = new normalizr.schema.Entity('author')
    let chat = new normalizr.schema.Entity('chat',{author:author})
    let messages = new normalizr.schema.Entity('messages',{chats:[chat]})

    let normalizedData = normalizr.normalize(originalData,messages)
    console.log("Data normalizada",normalizedData)
    let denormalizedData = normalizr.denormalize(normalizedData.result,messages,normalizedData.entities)
    console.log("Data desnormalizada",denormalizedData)

    //Porcentaje de compresión
    let originalLength = JSON.stringify(originalData).length
    let normalizedLength = JSON.stringify(normalizedData).length
    let compression = 100 - (normalizedLength * 100) / originalLength

    let element = document.getElementById('percentage')
    element.innerText = `${compression.toFixed(2)}%`

    //Chat log
    function dateFormat(date){
        if(!date) return
        const DATE = date.split('T')[0]
        const HOUR = date.split('T')[1]
        return DATE + ' ' + HOUR.substring(0,8)
    }

    let divChat = document.getElementById('chats')
    let message = data.map(chat =>{
        return `<div class='d-flex align-items-center flex-wrap'>
                    <img src='${chat.author.avatar}' class='pe-2' style='height:45px; width:auto;'/><span style='color:blue; font-weight:bold;'>${chat.author.id}</span>&nbsp;[<span style='color:brown;'>${dateFormat(chat.createdAt)}</span>]:&nbsp;<span style='color:green;'>${chat.message}</span>
                </div>`
    }).join('')
    divChat.innerHTML = message
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
        fetch('/api/productos')
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
};