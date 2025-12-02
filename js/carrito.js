// =========================================
//             INICIALIZACIÓN
// =========================================
let carrito = [];

// =========================================
//             LÓGICA PRINCIPAL (ONCLICK)
// =========================================

// Esta función se activa cuando oprimes el div en el HTML
function agregarProducto(id, nombre, precio) {
    
    // 1. Buscar si ya existe
    const productoEnCarrito = carrito.find(item => item.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
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
        listaCarrito.innerHTML = `<div class="carrito-vacio"><p>No hay productos en el carrito</p></div>`;
        if (totalPrecioElement) totalPrecioElement.textContent = '0';
        return;
    }

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const itemHTML = `
            <li class="bloque-item">
                <div class="info-producto">
                    <p class="nombre-item">${producto.nombre}</p>
                    <p class="precio-item">$${producto.precio.toLocaleString('es-AR')} c/u</p>
                </div>
                <div class="controles-cantidad">
                    <button class="btn-cantidad btn-restar" onclick="actualizarCantidadProducto(${producto.id}, ${producto.cantidad - 1})">-</button>
                    <span class="cantidad-item">${producto.cantidad}</span>
                    <button class="btn-cantidad btn-sumar" onclick="actualizarCantidadProducto(${producto.id}, ${producto.cantidad + 1})">+</button>
                    <button class="boton-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </div>
                <div class="subtotal-item">
                    <strong>$${subtotal.toLocaleString('es-AR')}</strong>
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
