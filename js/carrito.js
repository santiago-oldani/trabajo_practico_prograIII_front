// =========================================
//             INICIALIZACIÓN
// =========================================
let carrito = [];
let productosArray = [];
// =========================================
//             LÓGICA PRINCIPAL (ONCLICK)
// =========================================

const buscadorProductos = document.getElementById("buscador-productos");
const botonFinalizarCompra = document.getElementById("finalizar-compra");

botonFinalizarCompra.addEventListener("click", () => {
    const modal = document.getElementById("modal-container");
    modal.style.display = 'block';
    let carritoCargado = localStorage.getItem('carritoFarmacia');
    carritoCargado = JSON.parse(carritoCargado);
    console.log(carritoCargado);
    let montoTotal = 0;

    const productosHTML = carritoCargado ? carritoCargado.map((producto) => {
        montoTotal += (producto.precio * producto.cantidad);
        return `<div id="modal-contenedor-resumen">
                    <div id="modal-subcontenedor-resumen">
                        <div class="flex-row-center-center">
                            <span>${producto.cantidad}</span>
                            <span>${producto.nombre}</span>
                        </div>
                        <span>$${(producto.precio * producto.cantidad).toLocaleString('es-AR')}</span>
                    </div>
                    
                </div>`;
    }).join('') : 'El carrito está vacío.';

    modal.innerHTML = `
    <div id='modal' class='flex-col-center-center'>
        <i class="fa fa-window-close" id='cerrar-modal' aria-hidden="true"></i>
        <h4>Resumen de tu compra: </h4>
        <hr>
        
        ${productosHTML}  
        <hr>
        <span><strong>Total: $${montoTotal.toLocaleString('es-AR')}</strong></span>
        <button id="boton-imprimir">Imprimir ticket</button>
    </div>
`;

    const botonImprimir = document.getElementById("boton-imprimir");
    botonImprimir.addEventListener("click", imprimirTicket);

    const botonCerrarModal = document.getElementById("cerrar-modal");

    botonCerrarModal.addEventListener("click", () => {
        modal.style.display = 'none';
    })

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    })
})


function imprimirTicket() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    const MARGEN_X = 15; // Margen izquierdo fijo

    // Calcula el total de la compra antes de empezar a imprimir
    const totalCompra = carrito.reduce((sum, prod) => sum + (prod.precio * prod.cantidad), 0);

    // --- ENCABEZADO Y TÍTULO ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor('#0B3A66');
    doc.text("FARMACIA - TICKET DE COMPRA", MARGEN_X, y);
    y += 10;

    // Línea separadora
    doc.setDrawColor('#000');
    doc.line(MARGEN_X, y, 195, y);
    y += 8;

    // --- ENCABEZADOS DE TABLA ---
    // Definimos las coordenadas X exactas para las columnas:
    const COL_CANTIDAD = MARGEN_X;
    const COL_DESCRIPCION = MARGEN_X + 20;
    const COL_PRECIO_U_FINAL = 145; // Posición donde termina el texto de Precio U.
    const COL_SUBTOTAL_FINAL = 190; // Posición donde termina el texto del Subtotal.

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // Imprimir los encabezados
    doc.text("Cant.", COL_CANTIDAD, y);
    doc.text("Descripción", COL_DESCRIPCION, y);
    doc.text("Precio U.", COL_PRECIO_U_FINAL, y, { align: 'right' }); // Alineado a la derecha
    doc.text("Subtotal", COL_SUBTOTAL_FINAL, y, { align: 'right' }); // Alineado a la derecha
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // --- DETALLE DE PRODUCTOS ---
    carrito.forEach(prod => {
        const subtotal = prod.precio * prod.cantidad;
        // Limitar la longitud del nombre para que no se superponga con los precios
        const nombreProducto = prod.nombre.substring(0, 45) + (prod.nombre.length > 45 ? '...' : '');

        // 1. Cantidad (Alineación izquierda)
        doc.text(prod.cantidad.toString(), COL_CANTIDAD, y);

        // 2. Descripción (Alineación izquierda)
        doc.text(nombreProducto, COL_DESCRIPCION, y);

        // 3. Precio Unitario (Alineación derecha)
        doc.text(`$${prod.precio.toFixed(2)}`, COL_PRECIO_U_FINAL, y, { align: 'right' });

        // 4. Subtotal (Alineación derecha)
        doc.text(`$${subtotal.toFixed(2)}`, COL_SUBTOTAL_FINAL, y, { align: 'right' });

        // Espaciado corregido
        y += 6;

        if (y > 280) {
            doc.addPage();
            y = 15;
        }
    });

    // --- SEPARADOR Y TOTAL ---
    y += 5;
    doc.setDrawColor("#000");
    doc.line(MARGEN_X, y, 195, y);
    y += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);

    // Etiqueta "TOTAL"
    doc.text("TOTAL DE LA COMPRA:", 130, y, { align: 'right' }); // Mover la etiqueta más a la derecha

    // Valor del Total
    doc.setFontSize(16);
    doc.setTextColor('#000');
    doc.text(`$${totalCompra.toFixed(2)}`, COL_SUBTOTAL_FINAL, y, { align: 'right' }); // Usar la misma X final del Subtotal

    // --- GUARDAR PDF ---
    doc.save("ticket_compra.pdf");
}

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