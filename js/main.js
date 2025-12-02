const inputNombreUsuario = document.getElementById("bienvenida-input-nombre-usuario");
const containerBienvenida = document.getElementById("bienvenida-contenedor-nombre-invalido");
let nombreUsuario = "";
let carrito = [];

function guardarNombre() {
    const contieneNumero = /\d/.test(inputNombreUsuario.value);

    if (inputNombreUsuario.value.length > 2 && !contieneNumero) {
        nombreUsuario = inputNombreUsuario.value;
        window.location.href = "./views/productos.html"
    } else {
        containerBienvenida.innerHTML = "<p id='bienvenida-nombre-invalido'>*El nombre tiene que tener mas de 2 letras y no puede incluir números*</p>";
    }
}

const botonImprimir = document.getElementById("boton-imprimir");

function imprimirTicket() {
    alert("test");
    const idProductos = [];

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 10;

    doc.setFontSize(16);

    doc.text("Ticket de compra: ", 10, y);

    y += 10;

    carrito.forEach(prod => {
        idProductos.push(prod.id);
        doc.text(`${prod.nombre} - ${prod.precio}`, 20, y);
    });

    doc.save("ticket.pdf");

}

botonImprimir.addEventListener("click", imprimirTicket);
