// ==========================================
// 1. IMPORTACIÓN DE SERVICIOS
// ==========================================
import { listarEmpleados, crearEmpleado, actualizarEmpleado, eliminarEmpleado } from './js/services/empleadoService.js';
import { listarProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } from './js/services/productoService.js';
import { listarCategorias, obtenerCategoria, crearCategoria, actualizarCategoria, eliminarCategoria } from './js/services/categoriaService.js';
import { listarLaboratorios, obtenerLaboratorio, crearLaboratorio, actualizarLaboratorio, eliminarLaboratorio } from './js/services/laboratorioService.js';
import { listarPromociones, obtenerPromocion, crearPromocion, actualizarPromocion, eliminarPromocion } from './js/services/promocionService.js';

// Variables globales para saber qué estamos editando
let recursoActual = '';
let idEdicion = null;
// ==========================================
// 2. INICIALIZACIÓN AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    await cargarTablaProductos();
    await cargarTablaCategorias();
    await cargarTablaLaboratorios();
    await cargarTablaPromociones();
});

// ==========================================
// 3. FUNCIONES PARA DIBUJAR LAS TABLAS
// ==========================================

async function cargarTablaEmpleados() {
    const tbody = document.getElementById('tbody-empleados');
    try {
        const empleados = await listarEmpleados();
        tbody.innerHTML = '';
        empleados.forEach(e => {
            // Nota: Los IDs de Firebase son letras y números (strings), por eso llevan comillas '${e.id}'
            tbody.innerHTML += `
                <tr>
                    <td>${e.id}</td>
                    <td>${e.nombre}</td>
                    <td>${e.cargo}</td>
                    <td>
                        <button class="btn-accion" onclick="abrirModalEditar('empleado', '${e.id}')">✏️</button>
                        <button class="btn-accion" style="color:red;" onclick="borrarRegistro('empleado', '${e.id}')">🗑️</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4">Error al cargar Firebase.</td></tr>';
    }
}

async function cargarTablaProductos() {
    const tbody = document.getElementById('tbody-productos');
    tbody.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';
    
    try {
        const productos = await listarProductos();
        tbody.innerHTML = '';
        
        productos.forEach(p => {
            tbody.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.nombre}</td>
                    <td>${p.categoria}</td>
                    <td>S/ ${p.precio.toFixed(2)}</td>
                    <td>${p.stock}</td>
                    <td>
                        <button class="btn-accion" onclick="abrirModalEditar('producto', ${p.id})">✏️</button>
                        <button class="btn-accion" style="color:red;" onclick="borrarRegistro('producto', ${p.id})">🗑️</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6">Error al cargar los productos.</td></tr>';
        console.error(error);
    }
}

async function cargarTablaCategorias() {
    const tbody = document.getElementById('tbody-categorias');
    try {
        const categorias = await listarCategorias();
        tbody.innerHTML = '';
        
        categorias.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.nombre}</td>
                    <td>${c.descripcion}</td>
                    <td>
                        <button class="btn-accion" onclick="abrirModalEditar('categoria', ${c.id})">✏️</button>
                        <button class="btn-accion" style="color:red;" onclick="borrarRegistro('categoria', ${c.id})">🗑️</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4">Error al cargar.</td></tr>';
    }
}

async function cargarTablaLaboratorios() {
    const tbody = document.getElementById('tbody-laboratorios');
    try {
        const laboratorios = await listarLaboratorios();
        tbody.innerHTML = '';
        
        laboratorios.forEach(l => {
            tbody.innerHTML += `
                <tr>
                    <td>${l.id}</td>
                    <td>${l.nombre}</td>
                    <td>
                        <button class="btn-accion" onclick="abrirModalEditar('laboratorio', ${l.id})">✏️</button>
                        <button class="btn-accion" style="color:red;" onclick="borrarRegistro('laboratorio', ${l.id})">🗑️</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="3">Error al cargar.</td></tr>';
    }
}

async function cargarTablaPromociones() {
    const tbody = document.getElementById('tbody-promociones');
    try {
        const promociones = await listarPromociones();
        tbody.innerHTML = '';
        
        promociones.forEach(p => {
            const estado = p.activa ? '🟢 Activa' : '🔴 Inactiva';
            tbody.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.nombre}</td>
                    <td>${p.descuento}%</td>
                    <td>${estado}</td>
                    <td>
                        <button class="btn-accion" onclick="abrirModalEditar('promocion', ${p.id})">✏️</button>
                        <button class="btn-accion" style="color:red;" onclick="borrarRegistro('promocion', ${p.id})">🗑️</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="5">Error al cargar.</td></tr>';
    }
}

// ==========================================
// 4. PREPARACIÓN PARA MODALES Y ELIMINACIÓN
// (Se exponen a window para que los botones HTML las detecten)
// ==========================================

window.abrirModalEditar = function(tipoRecurso, id) {
    console.log(`Preparando para editar el recurso: ${tipoRecurso} con ID: ${id}`);
    // Aquí implementaremos la lógica del formulario en el siguiente paso
};

window.borrarRegistro = async function(tipoRecurso, id) {
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar este registro de ${tipoRecurso}?`);
    if (!confirmar) return;

    try {
        if (tipoRecurso === 'producto') await eliminarProducto(id);
        if (tipoRecurso === 'categoria') await eliminarCategoria(id);
        if (tipoRecurso === 'laboratorio') await eliminarLaboratorio(id);
        if (tipoRecurso === 'promocion') await eliminarPromocion(id);
        if (tipoRecurso === 'empleado') await eliminarEmpleado(id);

        // Recargar la tabla correspondiente después de eliminar
        if (tipoRecurso === 'producto') await cargarTablaProductos();
        if (tipoRecurso === 'categoria') await cargarTablaCategorias();
        if (tipoRecurso === 'laboratorio') await cargarTablaLaboratorios();
        if (tipoRecurso === 'promocion') await cargarTablaPromociones();
        if (tipoRecurso === 'empleado') await cargarTablaEmpleados();

        alert("Registro eliminado con éxito.");
    } catch (error) {
        alert("Ocurrió un error al intentar eliminar el registro.");
        console.error(error);
    }
};

// ==========================================
// 5. LÓGICA DEL MODAL Y EVENTOS DE BOTONES "NUEVO"
// ==========================================

const modal = document.getElementById('modalAdmin');
const modalTitulo = document.getElementById('modalTitulo');
const modalContenido = document.getElementById('modalFormularioContenido');

// Botones de cerrar modal
document.getElementById('btnCerrarModalAdmin').addEventListener('click', () => modal.hidden = true);

// Eventos para botones "+ Nuevo"
document.getElementById('btnNuevoProducto').addEventListener('click', () => abrirModal('producto'));
document.getElementById('btnNuevaCategoria').addEventListener('click', () => abrirModal('categoria'));
document.getElementById('btnNuevoLaboratorio').addEventListener('click', () => abrirModal('laboratorio'));
document.getElementById('btnNuevaPromocion').addEventListener('click', () => abrirModal('promocion'));
document.getElementById('btnNuevoEmpleado').addEventListener('click', () => abrirModal('empleado'));

window.abrirModalEditar = async function(tipo, id) {
    let data = null;
    try {
        if (tipo === 'producto') data = await obtenerProducto(id);
        if (tipo === 'categoria') data = await obtenerCategoria(id);
        if (tipo === 'laboratorio') data = await obtenerLaboratorio(id);
        if (tipo === 'promocion') data = await obtenerPromocion(id);
        
        await abrirModal(tipo, data);
    } catch (error) {
        alert("Error al cargar los datos para editar.");
        console.error(error);
    }
};

// Función central para abrir el modal (ahora es asíncrona para cargar los selects)
async function abrirModal(tipo, data = null) {
    recursoActual = tipo;
    idEdicion = data ? data.id : null;
    
    // Si vamos a abrir un producto, traemos las categorías y laboratorios para los <select>
    let listas = {};
    if (tipo === 'producto') {
        try {
            listas.categorias = await listarCategorias();
            listas.laboratorios = await listarLaboratorios();
        } catch (error) {
            console.error("No se pudieron cargar las listas para los selects", error);
        }
    }

    modalTitulo.innerText = data ? `Editar ${tipo.toUpperCase()}` : `Nuevo ${tipo.toUpperCase()}`;
    modalContenido.innerHTML = generarFormularioHTML(tipo, data, listas);
    modal.hidden = false;
}

// ==========================================
// 6. GENERACIÓN DINÁMICA DE FORMULARIOS (DISEÑO GRID)
// ==========================================
function generarFormularioHTML(tipo, data, listas = {}) {
    const d = data || {};
    let html = '<div class="form-grid">';

    if (tipo === 'producto') {
        // Construir opciones de Categorías
        let opcionesCategoria = '<option value="">Seleccionar...</option>';
        if (listas.categorias) {
            listas.categorias.forEach(c => {
                const selected = (d.categoria === c.nombre) ? 'selected' : '';
                opcionesCategoria += `<option value="${c.nombre}" ${selected}>${c.nombre}</option>`;
            });
        }

        // Construir opciones de Laboratorios
        let opcionesLaboratorio = '<option value="">Seleccionar...</option>';
        if (listas.laboratorios) {
            listas.laboratorios.forEach(l => {
                const selected = (d.laboratorio === l.nombre) ? 'selected' : '';
                opcionesLaboratorio += `<option value="${l.nombre}" ${selected}>${l.nombre}</option>`;
            });
        }

        html += `
            <!-- Fila 1 -->
            <div class="form-group">
                <label>Código</label>
                <input type="text" id="form-codigo" placeholder="Ej. MED001" value="${d.codigo || ''}">
            </div>
            <div class="form-group form-span-2">
                <label>Nombre del medicamento</label>
                <input type="text" id="form-nombre" placeholder="Ej. Paracetamol" value="${d.nombre || ''}">
            </div>
            <div class="form-group">
                <label>Categoría</label>
                <select id="form-categoria">
                    ${opcionesCategoria}
                </select>
            </div>
            
            <!-- Fila 2 -->
            <div class="form-group">
                <label>Principio activo</label>
                <input type="text" id="form-principio" placeholder="Ej. Paracetamol" value="${d.principioActivo || ''}">
            </div>
            <div class="form-group">
                <label>Concentración</label>
                <input type="text" id="form-concentracion" placeholder="Ej. 500 mg" value="${d.concentracion || ''}">
            </div>
            <div class="form-group">
                <label>Presentación</label>
                <input type="text" id="form-presentacion" placeholder="Ej. Caja x 20 tabletas" value="${d.presentacion || ''}">
            </div>
            <div class="form-group">
                <label>Laboratorio</label>
                <select id="form-laboratorio">
                    ${opcionesLaboratorio}
                </select>
            </div>

            <!-- Fila 3 -->
            <div class="form-group">
                <label>Precio (S/)</label>
                <input type="number" step="0.10" id="form-precio" placeholder="0.00" value="${d.precio || ''}">
            </div>
            <div class="form-group">
                <label>Stock</label>
                <input type="number" id="form-stock" placeholder="0" value="${d.stock || ''}">
            </div>
            <div class="form-group">
                <label>Fecha de vencimiento</label>
                <input type="date" id="form-vencimiento" value="${d.fechaVencimiento || ''}">
            </div>
            <div class="form-group">
                <label>Descuento (%)</label>
                <input type="number" id="form-descuento" placeholder="0" value="${d.descuento || ''}">
            </div>

            <!-- Fila 4 -->
            <div class="form-group form-span-4">
                <label>URL de imagen</label>
                <input type="text" id="form-imagen" placeholder="https://..." value="${d.imagen || ''}">
            </div>

            <!-- Fila 5 -->
            <div class="form-group form-span-4">
                <label>Descripción</label>
                <textarea id="form-descripcion" rows="3" placeholder="Descripción del medicamento">${d.descripcion || ''}</textarea>
            </div>
        `;
    } else if (tipo === 'categoria') {
        html += `
            <div class="form-group form-span-4">
                <label>Nombre de Categoría</label>
                <input type="text" id="form-nombre" placeholder="Ej. Analgésico" value="${d.nombre || ''}">
            </div>
            <div class="form-group form-span-4">
                <label>Descripción</label>
                <textarea id="form-descripcion" rows="3" placeholder="Descripción de la categoría...">${d.descripcion || ''}</textarea>
            </div>
        `;
    } else if (tipo === 'laboratorio') {
        html += `
            <div class="form-group form-span-4">
                <label>Nombre del Laboratorio</label>
                <input type="text" id="form-nombre" placeholder="Ej. Bayer" value="${d.nombre || ''}">
            </div>
        `;
    } else if (tipo === 'promocion') {
        html += `
            <div class="form-group form-span-2">
                <label>Nombre de la Promoción</label>
                <input type="text" id="form-nombre" placeholder="Ej. Descuento de Verano" value="${d.nombre || ''}">
            </div>
            <div class="form-group">
                <label>Descuento (%)</label>
                <input type="number" id="form-descuento" placeholder="10" value="${d.descuento || ''}">
            </div>
            <div class="form-group" style="flex-direction: row; align-items: flex-end; padding-bottom: 10px;">
                <input type="checkbox" id="form-activa" ${d.activa !== false ? 'checked' : ''} style="width: auto; margin-right: 10px;">
                <label for="form-activa" style="margin-bottom: 0;">Promoción Activa</label>
            </div>
            <div class="form-group form-span-4">
                <label>Descripción</label>
                <textarea id="form-descripcion" rows="3" placeholder="Detalles de la promoción...">${d.descripcion || ''}</textarea>
            </div>
        `;
    } else if (tipo === 'empleado') {
    html += `
        <div class="form-group form-span-2">
            <label>Nombre del Empleado</label>
            <input type="text" id="form-nombre" value="${d.nombre || ''}">
        </div>
        <div class="form-group form-span-2">
            <label>Cargo</label>
            <input type="text" id="form-cargo" value="${d.cargo || ''}">
        </div>
    `;
    }
    

    html += '</div>';
    return html;
}
// ==========================================
// 7. GUARDAR DATOS (POST Y PUT)
// ==========================================
document.getElementById('btnGuardar').addEventListener('click', async () => {
    let payload = {};

    if (recursoActual === 'categoria') {
        payload = {
            nombre: document.getElementById('form-nombre').value,
            descripcion: document.getElementById('form-descripcion').value
        };
    } else if (recursoActual === 'laboratorio') {
        payload = { 
            nombre: document.getElementById('form-nombre').value 
        };
    } else if (recursoActual === 'promocion') {
        payload = {
            nombre: document.getElementById('form-nombre').value,
            descripcion: document.getElementById('form-descripcion').value,
            descuento: parseInt(document.getElementById('form-descuento').value) || 0,
            activa: document.getElementById('form-activa').checked
        };
    } else if (recursoActual === 'producto') {
        payload = {
            codigo: document.getElementById('form-codigo').value,
            nombre: document.getElementById('form-nombre').value,
            categoria: document.getElementById('form-categoria').value,
            principioActivo: document.getElementById('form-principio').value,
            concentracion: document.getElementById('form-concentracion').value,
            presentacion: document.getElementById('form-presentacion').value,
            laboratorio: document.getElementById('form-laboratorio').value,
            precio: parseFloat(document.getElementById('form-precio').value) || 0,
            stock: parseInt(document.getElementById('form-stock').value) || 0,
            fechaVencimiento: document.getElementById('form-vencimiento').value,
            descuento: parseInt(document.getElementById('form-descuento').value) || 0,
            imagen: document.getElementById('form-imagen').value,
            descripcion: document.getElementById('form-descripcion').value
        };
        
    } else if (recursoActual === 'empleado') {
        payload = {
            nombre: document.getElementById('form-nombre').value,
            cargo: document.getElementById('form-cargo').value
        };
    }

    try {
        if (idEdicion) {
            payload.id = idEdicion;
            if (recursoActual === 'producto') await actualizarProducto(idEdicion, payload);
            if (recursoActual === 'categoria') await actualizarCategoria(idEdicion, payload);
            if (recursoActual === 'laboratorio') await actualizarLaboratorio(idEdicion, payload);
            if (recursoActual === 'promocion') await actualizarPromocion(idEdicion, payload);
            if (recursoActual === 'empleado') await actualizarEmpleado(idEdicion, payload);
            alert("Registro actualizado con éxito");
        } else {
            if (recursoActual === 'producto') await crearProducto(payload);
            if (recursoActual === 'categoria') await crearCategoria(payload);
            if (recursoActual === 'laboratorio') await crearLaboratorio(payload);
            if (recursoActual === 'promocion') await crearPromocion(payload);
            if (recursoActual === 'empleado') await crearEmpleado(payload);
            alert("Registro creado con éxito");
        }
        
        document.getElementById('modalAdmin').hidden = true;
        
        if (recursoActual === 'producto') await cargarTablaProductos();
        if (recursoActual === 'categoria') await cargarTablaCategorias();
        if (recursoActual === 'laboratorio') await cargarTablaLaboratorios();
        if (recursoActual === 'promocion') await cargarTablaPromociones();
        if (recursoActual === 'empleado') await cargarTablaEmpleados();

    } catch (error) {
        alert("Ocurrió un error al guardar.");
        console.error(error);
    }
});

// ==========================================
// REGISTRO DEL SERVICE WORKER (INSTALADOR PWA)
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registrado con éxito.');
    } catch (error) {
      console.error('Error al registrar el Service Worker:', error);
    }
  });
}