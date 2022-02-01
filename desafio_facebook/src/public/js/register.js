let form = document.getElementById('registerForm');
form.addEventListener('submit',(e) =>{
    e.preventDefault();
    let formData = new FormData(form);
    let user ={
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        age: formData.get('age'),
        username: formData.get('username'),
        password: formData.get('password'),
        avatar: formData.get('avatar')
    };

    if (!user.firstName||!user.lastName||!user.email||!user.username||!user.password||!user.age||user.avatar.size===0){
        alert("Falta completar algunos datos.");
    }else{
        fetch('/api/register',{
        method:'POST',
        body:formData
        })
        .then(result => result.json())
        .then(response =>{
            if(response.status === 'success'){
            form.reset()
            alert("Se ha registrado.")
            location.replace('/')
            }else{
                alert("Error al registrarse.")
            };
        });
    };
});