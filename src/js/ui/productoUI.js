const tabla = document.querySelector("#tablaProductos");
const loader = document.querySelector("#loader");
const tablaContainer = document.querySelector("#tablaContainer");
const errorContainer = document.querySelector("#errorContainer");
const errorMessage = document.querySelector("#errorMessage");
const totalProductos = document.querySelector("#totalProductos");
const stockTotal = document.querySelector("#stockTotal");
const valorInventario = document.querySelector("#valorInventario");
const proximosAVencer = document.querySelector("#proximosAVencer");
const formTitle = document.querySelector("#formTitle");
const btnGuardar = document.querySelector("#btnGuardar");
const btnCancelar = document.querySelector("#btnCancelar");
const form = document.querySelector("#formProducto");

function escaparHTML(valor = "") {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatearFecha(fecha) {
    if (!fecha) {
        return "—";
    }

    const partes = String(fecha).split("-");

    if (partes.length !== 3) {
        return escaparHTML(fecha);
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export function mostrarLoader() {
    loader.classList.remove("hidden");
    tablaContainer.classList.add("hidden");
    errorContainer.classList.add("hidden");
}

export function ocultarLoader() {
    loader.classList.add("hidden");
}

export function mostrarError(mensaje) {
    ocultarLoader();
    tablaContainer.classList.add("hidden");
    errorContainer.classList.remove("hidden");
    errorMessage.textContent = mensaje;
}

export function mostrarTabla() {
    ocultarLoader();
    errorContainer.classList.add("hidden");
    tablaContainer.classList.remove("hidden");
}

export function mostrarProductos(productos) {
    tabla.innerHTML = "";

    if (!productos || productos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="9" class="empty-row">
                    No existen medicamentos para mostrar.
                </td>
            </tr>
        `;

        actualizarEstadisticas([]);
        return;
    }

    productos.forEach(producto => {
        const fila = document.createElement("tr");
        const stockClass = producto.tieneStockBajo ? "stock-low" : "stock-good";
        const vencimientoClass = `expiry-${producto.estadoVencimiento}`;
        const vencimientoTexto = producto.estaVencido
            ? "Vencido"
            : formatearFecha(producto.fechaVencimiento);

        fila.innerHTML = `
            <td>${escaparHTML(producto.id)}</td>

            <td>
                <div class="product-cell">
                    <img
                        class="product-image"
                        src="${escaparHTML(producto.imagen || "")}" 
                        alt="${escaparHTML(producto.nombre)}"
                        onerror="this.style.display='none'"
                    >

                    <div>
                        <div class="product-name">
                            ${escaparHTML(producto.nombre)}
                        </div>
                        <div class="product-code">
                            ${escaparHTML(producto.codigo)}
                        </div>
                        <div class="product-meta">
                            ${escaparHTML(producto.concentracion)} · ${escaparHTML(producto.presentacion)}
                        </div>
                    </div>
                </div>
            </td>

            <td>${escaparHTML(producto.categoria)}</td>

            <td>${escaparHTML(producto.laboratorio)}</td>

            <td>S/ ${producto.precio.toFixed(2)}</td>

            <td>
                <span class="${stockClass}">
                    ${producto.stock}
                </span>
            </td>

            <td>
                <span class="${vencimientoClass}">
                    ${escaparHTML(vencimientoTexto)}
                </span>
            </td>

            <td>
                ${producto.descuento > 0
                    ? `<span class="discount">-${producto.descuento}%</span>`
                    : "—"}
            </td>

            <td>
                <div class="action-buttons">
                    <button class="btn btn-view" data-action="view" data-id="${escaparHTML(producto.id)}">
                        Ver
                    </button>

                    <button class="btn btn-edit" data-action="edit" data-id="${escaparHTML(producto.id)}">
                        Editar
                    </button>

                    <button class="btn btn-delete" data-action="delete" data-id="${escaparHTML(producto.id)}">
                        Eliminar
                    </button>
                </div>
            </td>
        `;

        tabla.appendChild(fila);
    });

    actualizarEstadisticas(productos);
}

function actualizarEstadisticas(productos) {
    const total = productos.length;

    const stock = productos.reduce(
        (acumulado, producto) => acumulado + producto.stock,
        0
    );

    const valor = productos.reduce(
        (acumulado, producto) => acumulado + (producto.precio * producto.stock),
        0
    );

    const proximos = productos.filter(
        producto => producto.estaProximoAVencer
    ).length;

    totalProductos.textContent = total;
    stockTotal.textContent = stock;
    valorInventario.textContent = `S/ ${valor.toFixed(2)}`;
    proximosAVencer.textContent = proximos;
}

export function obtenerDatosFormulario() {
    return {
        codigo: document.querySelector("#codigo").value.trim(),
        nombre: document.querySelector("#nombre").value.trim(),
        categoria: document.querySelector("#categoria").value,
        principioActivo: document.querySelector("#principioActivo").value.trim(),
        concentracion: document.querySelector("#concentracion").value.trim(),
        presentacion: document.querySelector("#presentacion").value.trim(),
        laboratorio: document.querySelector("#laboratorio").value.trim(),
        precio: Number(document.querySelector("#precio").value),
        stock: Number(document.querySelector("#stock").value),
        fechaVencimiento: document.querySelector("#fechaVencimiento").value,
        descuento: Number(document.querySelector("#descuento").value),
        imagen: document.querySelector("#imagen").value.trim(),
        descripcion: document.querySelector("#descripcion").value.trim()
    };
}

export function cargarFormulario(producto) {
    document.querySelector("#productoId").value = producto.id ?? "";
    document.querySelector("#codigo").value = producto.codigo ?? "";
    document.querySelector("#nombre").value = producto.nombre ?? "";
    document.querySelector("#categoria").value = producto.categoria ?? "";
    document.querySelector("#principioActivo").value = producto.principioActivo ?? "";
    document.querySelector("#concentracion").value = producto.concentracion ?? "";
    document.querySelector("#presentacion").value = producto.presentacion ?? "";
    document.querySelector("#laboratorio").value = producto.laboratorio ?? "";
    document.querySelector("#precio").value = producto.precio ?? 0;
    document.querySelector("#stock").value = producto.stock ?? 0;
    document.querySelector("#fechaVencimiento").value = producto.fechaVencimiento ?? "";
    document.querySelector("#descuento").value = producto.descuento ?? 0;
    document.querySelector("#imagen").value = producto.imagen ?? "";
    document.querySelector("#descripcion").value = producto.descripcion ?? "";

    formTitle.textContent = "Editar medicamento";
    btnGuardar.textContent = "Actualizar medicamento";
    btnCancelar.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

export function limpiarFormulario() {
    form.reset();

    document.querySelector("#productoId").value = "";
    document.querySelector("#descuento").value = 0;

    formTitle.textContent = "Nuevo medicamento";
    btnGuardar.textContent = "Guardar medicamento";
    btnCancelar.classList.add("hidden");
}

export function mostrarDetalle(producto) {
    const modal = document.querySelector("#modal");
    const modalBody = document.querySelector("#modalBody");

    const vencimientoTexto = producto.estaVencido
        ? "Vencido"
        : formatearFecha(producto.fechaVencimiento);

    const estadoClass = `expiry-${producto.estadoVencimiento}`;

    modalBody.innerHTML = `
        <div class="modal-title-row">
            <div>
                <h2>${escaparHTML(producto.nombre)}</h2>
                <p>${escaparHTML(producto.descripcion)}</p>
            </div>
            <span class="status-badge ${estadoClass}">
                ${producto.estaVencido ? "Vencido" : producto.estaProximoAVencer ? "Próximo a vencer" : "Vigente"}
            </span>
        </div>

        <div class="detail-grid">
            <div class="detail-item">
                <span class="detail-label">Código</span>
                <span class="detail-value">${escaparHTML(producto.codigo)}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Categoría</span>
                <span class="detail-value">${escaparHTML(producto.categoria)}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Principio activo</span>
                <span class="detail-value">${escaparHTML(producto.principioActivo)}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Concentración</span>
                <span class="detail-value">${escaparHTML(producto.concentracion)}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Presentación</span>
                <span class="detail-value">${escaparHTML(producto.presentacion)}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Laboratorio</span>
                <span class="detail-value">${escaparHTML(producto.laboratorio)}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Precio</span>
                <span class="detail-value">S/ ${producto.precio.toFixed(2)}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Precio con descuento</span>
                <span class="detail-value">S/ ${producto.precioFinal.toFixed(2)}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Stock</span>
                <span class="detail-value">${producto.stock}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Fecha de vencimiento</span>
                <span class="detail-value">${escaparHTML(vencimientoTexto)}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Descuento</span>
                <span class="detail-value">${producto.descuento}%</span>
            </div>
        </div>
    `;

    modal.classList.remove("hidden");
}

export function cerrarModal() {
    document.querySelector("#modal").classList.add("hidden");
}

export function mostrarToast(mensaje) {
    const toast = document.querySelector("#toast");
    toast.textContent = mensaje;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
