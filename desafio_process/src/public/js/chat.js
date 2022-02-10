const socket = io();

let user;
fetch('/api/login')
    .then(result => result.json())
    .then(response =>{
        if(response.status === 'error'){
        location.replace('/')
        }else{
        user = response;
        let p = document.getElementById('username');
        p.innerHTML = `<h2>Bienvenid@ <strong>${user.username}</strong>!</h2>`;
        };
    }
);

document.getElementById('message').addEventListener('keyup',(e) =>{
    if(e.key === 'Enter')
        if(e.target.value){
            socket.emit('chats',{message:e.target.value,user:user})
            e.target.value = ''
        }
});

socket.on('chats',data =>{
    let divChat = document.getElementById('chats')
    let message = data.map(chat =>{
        return `<div class='d-flex'>
                <img src='${chat.user.avatar}' style='height: 45px;'/><span style='color:blue; font-weight:bold;'>${chat.user.email} </span> [<span style='color: brown;'>${formatISODate(chat.createdAt)}</span>]: <span>${chat.text}</span>
            </div>`
    }).join('')
    divChat.innerHTML = message
});

function formatISODate(date){
    if(!date) return
    const DATE = date.split('T')[0]
    const HOUR = date.split('T')[1]
    return DATE + ' ' + HOUR.substring(0, 8)
};

document.getElementById('logout').addEventListener('click',() => location.replace('/logout'));