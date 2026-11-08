// ⚠️ CAMBIA ESTE NÚMERO POR EL TUYO O EL DEL CLIENTE (Incluye el código de país, ej: 591 para Bolivia)
const NUMERO_WHATSAPP = "59170000000"; 

let totalArticulos = 0;
let productoActual = { nombre: "", precio: 0 };
let carrito = []; // Aquí se guardan los productos { nombre, precio, cantidad }

// 1. Lógica para filtrar categorías
function filtrarCategoria(categoria, event) {
    const productos = document.querySelectorAll('.producto-card');
    const botones = document.querySelectorAll('.categoria-btn');

    botones.forEach(boton => boton.classList.remove('activo'));
    if(event) event.target.classList.add('activo');

    productos.forEach(producto => {
        const categoriaProducto = producto.getAttribute('data-categoria');
        if (categoria === 'todos' || categoriaProducto === categoria) {
            producto.classList.remove('oculto');
        } else {
            producto.classList.add('oculto');
        }
    });
}

// 2. Abrir y cerrar modales genéricos
function cerrarModal(idModal) {
    document.getElementById(idModal).style.display = 'none';
}

// Cerrar modal si se hace clic fuera de la caja blanca
window.onclick = function(event) {
    if (event.target.classList.contains('modal-fondo')) {
        event.target.style.display = 'none';
    }
}

// 3. Modal de Detalle del Producto
function abrirModal(nombre, precio, descripcion, imagen) {
    productoActual = { nombre: nombre, precio: precio };
    document.getElementById('modal-titulo').innerText = nombre;
    document.getElementById('modal-precio').innerText = precio + "BS";
    document.getElementById('modal-descripcion').innerText = descripcion;
    document.getElementById('modal-img').src = imagen;
    document.getElementById('modal-cantidad').value = 1;
    document.getElementById('miModal').style.display = 'flex';
}

// 4. Añadir producto desde el Modal al Carrito
function añadirAlCarrito() {
    const cantidad = parseInt(document.getElementById('modal-cantidad').value);

    if (cantidad > 0) {
        // Verificamos si el producto ya está en el carrito para solo sumar la cantidad
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

// 5. Actualizar el contador flotante y la lista del carrito
function actualizarCarritoUI() {
    // Actualizar contador flotante
    totalArticulos = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.getElementById('contador-carrito').innerText = totalArticulos;
}

// 6. Abrir el Modal del Carrito
function abrirCarrito() {
    const listaHTML = document.getElementById('lista-carrito');
    const totalPrecioHTML = document.getElementById('total-precio');
    listaHTML.innerHTML = ''; // Limpiar la lista
    let totalPagar = 0;

    if (carrito.length === 0) {
        listaHTML.innerHTML = '<p style="text-align:center; color:#888;">Tu carrito está vacío.</p>';
    } else {
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            totalPagar += subtotal;
            
            // Creamos el HTML para cada producto en el carrito
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

// 7. ENVIAR POR WHATSAPP
function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("No tienes productos en el carrito.");
        return;
    }

    // Construir el mensaje
    let mensaje = "¡Hola! Quiero realizar el siguiente pedido:%0A%0A"; // %0A es un salto de línea en URL
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `▪ ${item.cantidad}x ${item.nombre} - ${subtotal}BS%0A`;
    });

    mensaje += `%0A*Total a pagar: ${total}BS*`;
    mensaje += `%0A%0APor favor, confírmenme la disponibilidad.`;

    // Crear el enlace de WhatsApp
    // Usamos wa.me que es la API oficial y funciona en PC y celular
    const url = `https://wa.me/${71595718}?text=${mensaje}`;

    // Abrir en una nueva pestaña
    window.open(url, '_blank');
}