document.addEventListener('submit', event=>{
    event.preventDefault();

    let form = document.querySelector('#prodForm');
    let data = new FormData(form);

    let datos = {
        title:data.get('title'),
        price:data.get('price'),
        thumbnail:data.get('thumbnail')
    }

    fetch('http://localhost:8080/api/productos',{
        method:'POST',
        body:JSON.stringify(datos),
        headers:{
            "Content-type":"application/json"
        }
    }).then(response=>{
        return response.json();
    }).then(json=>{
        console.log(json);
    })
})
