// ⚠️ CAMBIA ESTE NÚMERO POR EL TUYO O EL DEL CLIENTE
const NUMERO_WHATSAPP = "59170000000"; 

let totalArticulos = 0;
let productoActual = { nombre: "", precio: 0 };
let carrito = [];
let categoriaActual = 'todos'; // Guarda qué categoría está seleccionada

// 1. Lógica para buscar productos por nombre
function buscarProductos() {
    const textoBusqueda = document.getElementById('buscador').value.toLowerCase();
    const productos = document.querySelectorAll('.producto-card');
    let resultadosVisibles = 0;

    productos.forEach(producto => {
        const nombreProducto = producto.querySelector('.producto-nombre').innerText.toLowerCase();
        const categoriaProducto = producto.getAttribute('data-categoria');

        // Comprobar si coincide con la búsqueda Y con la categoría seleccionada
        const coincideBusqueda = nombreProducto.includes(textoBusqueda);
        const coincideCategoria = (categoriaActual === 'todos' || categoriaProducto === categoriaActual);

        if (coincideBusqueda && coincideCategoria) {
            producto.classList.remove('oculto');
            resultadosVisibles++;
        } else {
            producto.classList.add('oculto');
        }
    });

    // Mostrar u ocultar mensaje de "Sin resultados"
    const mensajeSinResultados = document.getElementById('sin-resultados');
    if (resultadosVisibles === 0) {
        mensajeSinResultados.classList.remove('oculto');
    } else {
        mensajeSinResultados.classList.add('oculto');
    }
}

// 2. Lógica para filtrar categorías
function filtrarCategoria(categoria, event) {
    categoriaActual = categoria; // Guardamos la categoría actual
    const botones = document.querySelectorAll('.categoria-btn');

    botones.forEach(boton => boton.classList.remove('activo'));
    if(event) event.target.classList.add('activo');

    // Llamamos a buscarProductos() para que aplique ambos filtros (texto y categoría)
    buscarProductos(); 
}

// 3. Abrir y cerrar modales
function cerrarModal(idModal) {
    document.getElementById(idModal).style.display = 'none';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-fondo')) {
        event.target.style.display = 'none';
    }
}

// 4. Modal de Detalle del Producto
function abrirModal(nombre, precio, descripcion, imagen) {
    productoActual = { nombre: nombre, precio: precio };
    document.getElementById('modal-titulo').innerText = nombre;
    document.getElementById('modal-precio').innerText = precio + "BS";
    document.getElementById('modal-descripcion').innerText = descripcion;
    document.getElementById('modal-img').src = imagen;
    document.getElementById('modal-cantidad').value = 1;
    document.getElementById('miModal').style.display = 'flex';
}

// 5. Añadir producto al Carrito
function añadirAlCarrito() {
    const cantidad = parseInt(document.getElementById('modal-cantidad').value);

    if (cantidad > 0) {
        const index = carrito.findIndex(item => item.nombre === productoActual.nombre);
        
        if (index !== -1) {
            carrito[index].cantidad += cantidad;
        } else {
            carrito.push({
                nombre: productoActual.nombre,
                precio: productoActual.precio,
                cantidad: cantidad
            });
        }

        actualizarCarritoUI();
        cerrarModal('miModal');
    } else {
        alert("Por favor, selecciona una cantidad mayor a 0.");
    }
}

// 6. Actualizar el contador flotante
function actualizarCarritoUI() {
    totalArticulos = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.getElementById('contador-carrito').innerText = totalArticulos;
}

// 7. Abrir el Modal del Carrito
function abrirCarrito() {
    const listaHTML = document.getElementById('lista-carrito');
    const totalPrecioHTML = document.getElementById('total-precio');
    listaHTML.innerHTML = ''; 
    let totalPagar = 0;

    if (carrito.length === 0) {
        listaHTML.innerHTML = '<p style="text-align:center; color:#888;">Tu carrito está vacío.</p>';
    } else {
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            totalPagar += subtotal;
            
            const div = document.createElement('div');
            div.className = 'item-carrito';
            div.innerHTML = `
                <span>${item.cantidad}x ${item.nombre}</span>
                <span>${subtotal}BS</span>
            `;
            listaHTML.appendChild(div);
        });
    }

    totalPrecioHTML.innerText = totalPagar + "BS";
    document.getElementById('modalCarrito').style.display = 'flex';
}

// 8. ENVIAR POR WHATSAPP
function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("No tienes productos en el carrito.");
        return;
    }

    let mensaje = "¡Hola! Quiero realizar el siguiente pedido:%0A%0A"; 
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `▪ ${item.cantidad}x ${item.nombre} - ${subtotal}BS%0A`;
    });

    mensaje += `%0A*Total a pagar: ${total}BS*`;
    mensaje += `%0A%0APor favor, confírmenme la disponibilidad.`;

    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`;
    window.open(url, '_blank');
}