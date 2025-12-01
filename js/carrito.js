
function agregarAlCarrito(idProducto) {
  // Buscar
  const producto = lista_frutas.find(fruta => fruta.id === idProducto);

  if (!producto) {
    console.error('Producto no encontrado');
    return;
  }
  // Verificar si el producto ya está en el carrito
  const productoEnCarrito = carrito.find(item => item.id === idProducto);

  if (productoEnCarrito) {
    // Si ya existe, aumentar la cantidad
    productoEnCarrito.cantidad += 1;
  } else {
    // Si no existe, agregarlo al carrito con cantidad 1
    carrito.push({
      ...producto,
      cantidad: 1
    });
  }
  // Actualizar contador y mostrar carrito
  actualizarContadorCarrito();
  mostrarCarrito();
  console.log('Carrito actual:', carrito);
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  contadorCarrito = carrito.reduce((total, producto) => total + producto.cantidad, 0);

  const contadorElement = document.getElementById('contador-carrito');
  if (contadorElement) {
    contadorElement.textContent = contadorCarrito;
  }
}

// Función para mostrar el carrito en pantalla
function mostrarCarrito() {
  const listaCarrito = document.getElementById('lista-carrito');
  const totalPrecioElement = document.getElementById('total-precio');

  if (!listaCarrito) return;

  // Limpiar lista actual
  listaCarrito.innerHTML = '';

  if (carrito.length === 0) {
    listaCarrito.innerHTML = `
      <div class="carrito-vacio">
        <p>No hay productos en el carrito</p>
      </div>
    `;

    if (totalPrecioElement) {
      totalPrecioElement.textContent = '0';
    }
    return;
  }

  // Calcular total
  let total = 0;

  // Crear HTML para cada item del carrito
  carrito.forEach(producto => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    const itemHTML = `
      <li class="bloque-item">
        <p class="nombre-item">
          ${producto.nombre} - $${producto.precio} x ${producto.cantidad}
        </p>
        <button class="boton-eliminar" data-id="${producto.id}">Eliminar</button>
      </li>
    `;
    listaCarrito.innerHTML += itemHTML;
  });

  // Actualizar total
  if (totalPrecioElement) {
    totalPrecioElement.textContent = total;
  }

  // Agregar event listeners a los botones eliminar
  agregarEventListenersEliminar();
}

// Función para agregar event listeners a los botones eliminar
function agregarEventListenersEliminar() {
  const botonesEliminar = document.querySelectorAll('.boton-eliminar');

  botonesEliminar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      eliminarProducto(id);
    });
  });
}

// Función para eliminar productos del carrito
function eliminarProducto(idProducto) {
  // Filtrar el producto a eliminar
  carrito = carrito.filter(producto => producto.id !== idProducto);

  // Actualizar interfaz
  actualizarContadorCarrito();
  mostrarCarrito();

  console.log('Producto eliminado. Carrito actual:', carrito);
}

function guardarCarrito() {
  try {
    localStorage.setItem('carritoFrutas', JSON.stringify(carrito));
    console.log('Carrito guardado en localStorage');
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
}

// Función para cargar el carrito desde localStorage
function cargarCarrito() {
  try {
    const carritoGuardado = localStorage.getItem('carritoFrutas');

    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
      console.log('Carrito cargado desde localStorage:', carrito);

      // Actualizar la interfaz con los datos cargados
      actualizarContadorCarrito();
      mostrarCarrito();
    }
  } catch (error) {
    console.error('Error al cargar desde localStorage:', error);
    // Si hay error, inicializar carrito vacío
    carrito = [];
  }
}

// Actualizar las funciones existentes para que usen localStorage
function agregarAlCarrito(idProducto) {
  const producto = lista_frutas.find(fruta => fruta.id === idProducto);

  if (!producto) {
    console.error('Producto no encontrado');
    return;
  }

  const productoEnCarrito = carrito.find(item => item.id === idProducto);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad += 1;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1
    });
  }

  actualizarContadorCarrito();
  mostrarCarrito();
  guardarCarrito();

  console.log('Carrito actual:', carrito);
}

function eliminarProducto(idProducto) {
  carrito = carrito.filter(producto => producto.id !== idProducto);

  actualizarContadorCarrito();
  mostrarCarrito();
  guardarCarrito(); // ← Guardar en localStorage después de eliminar

  console.log('Producto eliminado. Carrito actual:', carrito);
}

function actualizarCantidadProducto(idProducto, nuevaCantidad) {
  const productoEnCarrito = carrito.find(item => item.id === idProducto);

  if (!productoEnCarrito) return;

  if (nuevaCantidad <= 0) {
    // Si la cantidad es 0 o menor, eliminar el producto
    eliminarProducto(idProducto);
  } else {
    // Actualizar la cantidad
    productoEnCarrito.cantidad = nuevaCantidad;

    // Actualizar interfaz y guardar
    actualizarContadorCarrito();
    mostrarCarrito();
    guardarCarrito();

    console.log('Cantidad actualizada. Carrito:', carrito);
  }
}

// Modificar la función mostrarCarrito para incluir contadores
function mostrarCarrito() {
  const listaCarrito = document.getElementById('lista-carrito');
  const totalPrecioElement = document.getElementById('total-precio');

  if (!listaCarrito) return;

  listaCarrito.innerHTML = '';

  if (carrito.length === 0) {
    listaCarrito.innerHTML = `
      <div class="carrito-vacio">
        <p>No hay productos en el carrito</p>
      </div>
    `;
    
    if (totalPrecioElement) {
      totalPrecioElement.textContent = '0';
    }
    return;
  }

  let total = 0;

  carrito.forEach(producto => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    const itemHTML = `
      <li class="bloque-item">
        <div class="info-producto">
          <p class="nombre-item">${producto.nombre}</p>
          <p class="precio-item">$${producto.precio} c/u</p>
        </div>
        <div class="controles-cantidad">
          <button class="btn-cantidad btn-restar" data-id="${producto.id}">-</button>
          <span class="cantidad-item">${producto.cantidad}</span>
          <button class="btn-cantidad btn-sumar" data-id="${producto.id}">+</button>
          <button class="boton-eliminar" data-id="${producto.id}">Eliminar</button>
        </div>
        <div class="subtotal-item">
          <strong>$${subtotal}</strong>
        </div>
      </li>
    `;
    listaCarrito.innerHTML += itemHTML;
  });

  // Mostrar total
  if (totalPrecioElement) {
    totalPrecioElement.textContent = total;
  }

  // Agregar event listeners
  agregarEventListenersEliminar();
  agregarEventListenersCantidad();
}

// Función para agregar event listeners a los botones de cantidad
function agregarEventListenersCantidad() {
  // Botones de sumar
  const botonesSumar = document.querySelectorAll('.btn-sumar');
  botonesSumar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      const producto = carrito.find(item => item.id === id);
      if (producto) {
        actualizarCantidadProducto(id, producto.cantidad + 1);
      }
    });
  });

  // Botones de restar
  const botonesRestar = document.querySelectorAll('.btn-restar');
  botonesRestar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      const producto = carrito.find(item => item.id === id);
      if (producto) {
        actualizarCantidadProducto(id, producto.cantidad - 1);
      }
    });
  });
}
