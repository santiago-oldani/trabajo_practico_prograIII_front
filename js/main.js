const inputNombreUsuario = document.getElementById("bienvenida-input-nombre-usuario");
const containerBienvenida = document.getElementById("bienvenida-contenedor-nombre-invalido");
let nombreUsuario = "";

function guardarNombre(){
    const contieneNumero = /\d/.test(inputNombreUsuario.value);

    if(inputNombreUsuario.value.length > 2 && !contieneNumero){
        nombreUsuario = inputNombreUsuario.value;
        window.location.href = "./views/productos.html"
    }else{
        containerBienvenida.innerHTML = "<p id='bienvenida-nombre-invalido'>*El nombre tiene que tener mas de 2 letras y no puede incluir números*</p>";
    }
}

