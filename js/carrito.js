// =========================================
//             INICIALIZACIÓN
// =========================================
let carrito = [];
let productosArray = [];
// =========================================
//             LÓGICA PRINCIPAL (ONCLICK)
// =========================================

const modalContainer = document.getElementById("modal-container");
const buscadorProductos = document.getElementById("buscador-productos");
const botonFinalizarCompra = document.getElementById("finalizar-compra");

botonFinalizarCompra.addEventListener("click", () =>{
    modalContainer.style.display = "block";
})

buscadorProductos.addEventListener("keyup", (e) => buscarProductos(e));

function buscarProductos(e) {
    let productosFiltrados = productosArray.filter(producto => producto.nombre.toLowerCase().includes(e.target.value.toLowerCase()));
    mostrarProductos(productosFiltrados);
}

const productosContenedor = document.getElementById("productos-contenedor");

async function traerProductos() {
    try {
        const response = await fetch("http://localhost:3000/api/products");

        if (!response.ok) {
            throw new Error(`HTTP: ${response.status}`)
        }

        productosArray = await response.json();
        productosArray = productosArray.payload;

        mostrarProductos(productosArray);

    } catch (error) {
        console.error("error al obtener los productos", error);
    }
}

function mostrarProductos(arrayDeProductos) {
    let productosHTML = ""
    if (arrayDeProductos.length === 0) {
        productosHTML = "Cargando productos..."
    } else {
        arrayDeProductos.forEach((producto) => {
            if (producto.activo) {
                productosHTML += `
                            <div id="producto">
                                <div class="imagen-contenedor"> 
                                    <img src="${producto.imagen}" alt="">
                                </div>
                                <div id="producto-subcontenedor-start">
                                    <div id="nombre-categoria-producto-contenedor">
                                        <h5>${producto.nombre}</h5>
                                        <h6>${producto.categoria}</h6>
                                    </div>
                                    <p>$${producto.precio.toLocaleString('es-AR')}</p>
                                    <div id="agregar-producto-button" onclick="agregarProducto(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.imagen}')">
                                    Agregar producto
                                    </div>
                                </div>
                                
                            </div>
                        `
            }
            productosContenedor.innerHTML = productosHTML;
        })
    }
}

function filtrarProductos(divClickeado, categoria) {
    const botonesCategoria = document.querySelectorAll('.productos-categorias');

    botonesCategoria.forEach(boton => {
        boton.classList.remove('categoria-activa');
    });

    divClickeado.classList.add('categoria-activa');

    if (categoria !== "todos") {
        let filteredArrayProductos = productosArray.filter((producto) => producto.categoria === categoria);
        mostrarProductos(filteredArrayProductos);
    } else {
        mostrarProductos(productosArray);
    }
}


// Esta función se activa cuando oprimes el div en el HTML
function agregarProducto(id, nombre, precio, imagen) {
    // 1. Buscar si ya existe
    const productoEnCarrito = carrito.find(item => item.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1
        });
    }

    // 2. Actualizar interfaz y guardar
    actualizarContadorCarrito();
    mostrarCarrito();
    guardarCarrito();

    // 3. ABRIR EL CARRITO AUTOMÁTICAMENTE
    const carritoLateral = document.getElementById('carrito-lateral');
    if (carritoLateral) {
        carritoLateral.classList.add('visible');
    }
}

// =========================================
//             FUNCIONES DE AYUDA
// =========================================

function guardarCarrito() {
    localStorage.setItem('carritoFarmacia', JSON.stringify(carrito));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carritoFarmacia');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
        // No mostramos el carrito al cargar la página, solo actualizamos el contador
    }
}

function actualizarContadorCarrito() {
    const contadorCarrito = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    const contadorElement = document.getElementById('contador-carrito');
    if (contadorElement) {
        contadorElement.textContent = contadorCarrito;
    }
}

function vaciarCarrito() {
    carrito = [];
    actualizarContadorCarrito();
    mostrarCarrito();
    guardarCarrito();
}

function eliminarProducto(idProducto) {
    carrito = carrito.filter(producto => producto.id !== idProducto);
    actualizarContadorCarrito();
    mostrarCarrito();
    guardarCarrito();
}

function actualizarCantidadProducto(idProducto, nuevaCantidad) {
    const productoEnCarrito = carrito.find(item => item.id === idProducto);
    if (!productoEnCarrito) return;

    if (nuevaCantidad <= 0) {
        eliminarProducto(idProducto);
    } else {
        productoEnCarrito.cantidad = nuevaCantidad;
        actualizarContadorCarrito();
        mostrarCarrito();
        guardarCarrito();
    }
}

// =========================================
//             RENDERIZADO DEL CARRITO
// =========================================

function mostrarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalPrecioElement = document.getElementById('total-precio');

    if (!listaCarrito) return;

    listaCarrito.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `<div class="carrito-vacio"><p>No hay productos en el carrito.</p></div>`;
        if (totalPrecioElement) totalPrecioElement.textContent = '0';
        return;
    }

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const itemHTML = `
            <li class="bloque-item">
                <img id="carrito-imagen-producto" src="${producto.imagen}" alt="">
                <div class="info-producto">
                    <p class="nombre-item">${producto.nombre}</p>
                    <p class="precio-item">$${producto.precio.toLocaleString('es-AR')} c/u</p>
                    <div class="controles-cantidad">
                    <button class="btn-cantidad btn-restar" onclick="actualizarCantidadProducto(${producto.id}, ${producto.cantidad - 1})"><i class="fa fa-minus" aria-hidden="true"></i></button>
                    <span class="cantidad-item">${producto.cantidad}</span>
                    <button class="btn-cantidad btn-sumar" onclick="actualizarCantidadProducto(${producto.id}, ${producto.cantidad + 1})"><i class="fa fa-plus" aria-hidden="true"></i></button>
                </div>
                </div>
                
                <div class="subtotal-item">
                    <div class="boton-eliminar" onclick="eliminarProducto(${producto.id})"><i class="fa fa-times" aria-hidden="true"></i></div>
                    <span>$${subtotal.toLocaleString('es-AR')}</span>
                </div>
                
            </li>
        `;
        listaCarrito.innerHTML += itemHTML;
    });

    if (totalPrecioElement) {
        totalPrecioElement.textContent = total.toLocaleString('es-AR');
    }
}

// =========================================
//             EVENTOS GLOBALES
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();

    // Solo configuramos los botones estáticos del carrito (abrir/cerrar/vaciar)
    const botonAbrir = document.getElementById('nav-carrito');
    const botonCerrar = document.getElementById('cerrar-carrito');
    const carritoLateral = document.getElementById('carrito-lateral');
    const botonVaciar = document.getElementById('vaciar-carrito');

    if (botonAbrir && carritoLateral) {
        botonAbrir.addEventListener('click', () => {
            carritoLateral.classList.add('visible');
            mostrarCarrito();
        });
    }
    if (botonCerrar && carritoLateral) {
        botonCerrar.addEventListener('click', () => {
            carritoLateral.classList.remove('visible');
        });
    }
    if (botonVaciar) {
        botonVaciar.addEventListener('click', vaciarCarrito);
    }
});

function init() {
    traerProductos();
}

init();