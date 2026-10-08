import { listarProductos, obtenerProducto } from './js/services/productoService.js';
import { listarCategorias } from './js/services/categoriaService.js';
import { listarLaboratorios } from './js/services/laboratorioService.js';
import { listarPromociones } from './js/services/promocionService.js';

const $ = id => document.getElementById(id);
const money = n => `S/ ${Number(n || 0).toFixed(2)}`;
const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imageSrc = p => { const raw = String(p.imagen || '').trim(); if (!raw) return ''; try { const u = new URL(raw, 'https://farmacia-6sdu.onrender.com/'); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
const imageTag = p => imageSrc(p) ? `<img class="product-image" src="${safe(imageSrc(p))}" alt="Imagen de ${safe(p.nombre)}" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="image-fallback" hidden>✚</span>` : '<span class="image-fallback">✚</span>';
const asList = data => Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
let productos = [];
let carrito = [];
try { const stored = JSON.parse(localStorage.getItem('farmaciaCarrito') || '[]'); carrito = Array.isArray(stored) ? stored : []; } catch { carrito = []; }

function aviso(message) { $('aviso').textContent = message; $('aviso').hidden = false; clearTimeout(aviso.timer); aviso.timer = setTimeout(() => $('aviso').hidden = true, 3500); }
function guardarCarrito() { localStorage.setItem('farmaciaCarrito', JSON.stringify(carrito)); renderCarrito(); }
function disponible(p) { return Number(p.stock) > 0 && !p.estaVencido; }
function precio(p) { return Number(p.precioFinal ?? (Number(p.precio) * (1 - Number(p.descuento || 0) / 100))); }
function renderProductos() {
  const q = $('buscarProducto').value.trim().toLocaleLowerCase();
  const cat = $('filtroCategoria').value;
  const lab = $('filtroLaboratorio').value;
  const filtrados = productos.filter(p => (!cat || p.categoria === cat) && (!lab || p.laboratorio === lab) && [p.nombre,p.codigo,p.principioActivo,p.categoria,p.laboratorio].some(v => String(v ?? '').toLocaleLowerCase().includes(q)));
  $('estadoProductos').textContent = `${filtrados.length} medicamento(s) encontrado(s)`;
  $('listaProductos').innerHTML = filtrados.length ? filtrados.map(p => `<article class="producto-card"><div class="pill">${safe(p.categoria)}</div><div class="product-symbol">${imageTag(p)}</div><h3>${safe(p.nombre)}</h3><p class="muted">${safe(p.laboratorio)} · ${safe(p.presentacion)}</p><p class="price">${money(precio(p))}</p><p class="muted">${disponible(p) ? `${Number(p.stock)} unidades disponibles` : 'No disponible'}</p><div class="actions"><button data-action="detalle" data-id="${safe(p.id)}" class="secondary">Ver detalle</button><button data-action="agregar" data-id="${safe(p.id)}" ${disponible(p) ? '' : 'disabled'}>Agregar</button></div></article>`).join('') : '<p class="empty">No hay medicamentos con estos filtros.</p>';
}
async function cargarProductos() {
  $('estadoProductos').textContent = 'Cargando medicamentos...'; $('listaProductos').innerHTML = '';
  try { productos = asList(await listarProductos()); renderProductos(); }
  catch (e) { $('estadoProductos').textContent = `No se pudo cargar el catálogo: ${e.message}`; $('listaProductos').innerHTML = '<button id="reintentar">Reintentar</button>'; $('reintentar').onclick = cargarProductos; }
}
async function llenarFiltro(id, cargar, nombre) {
  const select = $(id);
  try { const data = asList(await cargar()); for (const item of data) { const option = document.createElement('option'); option.value = item.nombre; option.textContent = item.nombre; select.append(option); } }
  catch (e) { console.error(`Error en ${nombre}`, e); aviso(`No se pudieron cargar ${nombre}.`); }
}
async function cargarPromociones() {
  const node = $('listaPromociones'); node.textContent = 'Cargando promociones...';
  try { const data = asList(await listarPromociones()).filter(p => p.activa !== false); node.innerHTML = data.length ? data.map(p => `<article class="promo-card"><span class="pill">Promoción</span><h3>${safe(p.nombre)}</h3><p>${safe(p.descripcion)}</p>${Number.isFinite(Number(p.descuento)) ? `<strong>${Number(p.descuento)}% de descuento</strong>` : ''}</article>`).join('') : '<p>No hay promociones disponibles actualmente.</p>'; }
  catch(e) { node.innerHTML = '<p>No se pudieron cargar las promociones.</p><button id="retryPromos">Reintentar</button>'; $('retryPromos').onclick = cargarPromociones; }
}
async function verDetalle(id) {
  $('modal').hidden = false; $('detalleContenido').textContent = 'Cargando detalle...';
  try { const p = await obtenerProducto(id); $('detalleContenido').innerHTML = `<h2 id="modalTitulo">${safe(p.nombre)}</h2><div class="detail-image">${imageTag(p)}</div><p>${safe(p.descripcion || 'Información del medicamento')}</p><dl class="detail-list">${[['Código',p.codigo],['Categoría',p.categoria],['Laboratorio',p.laboratorio],['Principio activo',p.principioActivo],['Concentración',p.concentracion],['Presentación',p.presentacion],['Precio',money(precio(p))],['Stock',p.stock],['Vencimiento',p.fechaVencimiento]].map(([a,b]) => `<dt>${a}</dt><dd>${safe(b)}</dd>`).join('')}</dl>`; }
  catch(e) { $('detalleContenido').textContent = `No se pudo consultar el detalle: ${e.message}`; }
}
function agregar(id) {
  const p = productos.find(x => String(x.id) === String(id)); if (!p || !disponible(p)) return;
  const item = carrito.find(x => String(x.id) === String(id)); const cantidad = item?.cantidad || 0;
  if (cantidad >= Number(p.stock)) { aviso('No hay más unidades disponibles.'); return; }
  if (item) item.cantidad++; else carrito.push({id:p.id,nombre:p.nombre,precio:precio(p),cantidad:1,stock:Number(p.stock)});
  guardarCarrito(); aviso(`${p.nombre} agregado al carrito.`);
}
function renderCarrito() {
  $('cantidadCarrito').textContent = carrito.reduce((n,p) => n + p.cantidad, 0);
  $('listaCarrito').innerHTML = carrito.length ? carrito.map(p => `<div class="cart-item"><div><strong>${safe(p.nombre)}</strong><p class="muted">${money(p.precio)} por unidad</p></div><div class="cart-actions"><button class="secondary" data-cart="restar" data-id="${safe(p.id)}" aria-label="Restar una unidad">−</button><span>${p.cantidad}</span><button class="secondary" data-cart="sumar" data-id="${safe(p.id)}" aria-label="Sumar una unidad">+</button><button class="secondary" data-cart="quitar" data-id="${safe(p.id)}">Quitar</button></div><strong>${money(p.precio * p.cantidad)}</strong></div>`).join('') : '<p>Tu carrito está vacío. Agrega productos del catálogo.</p>';
  $('totalCarrito').textContent = carrito.reduce((n,p) => n + p.precio * p.cantidad, 0).toFixed(2);
  $('btnVaciarCarrito').disabled = !carrito.length;
  $('btnComprar').disabled = !carrito.length;
}
$('listaProductos').addEventListener('click', e => { const b = e.target.closest('button[data-action]'); if (!b) return; if (b.dataset.action === 'detalle') verDetalle(b.dataset.id); else agregar(b.dataset.id); });
$('listaCarrito').addEventListener('click', e => { const b = e.target.closest('button[data-cart]'); if (!b) return; const item = carrito.find(p => String(p.id) === b.dataset.id); if (!item) return; if (b.dataset.cart === 'quitar') carrito = carrito.filter(p => p !== item); else if (b.dataset.cart === 'restar') { item.cantidad--; if (!item.cantidad) carrito = carrito.filter(p => p !== item); } else { if (item.cantidad >= item.stock) { aviso('No hay más unidades disponibles.'); return; } item.cantidad++; } guardarCarrito(); });
$('btnComprar').onclick = () => {
  if (!carrito.length) return;
  carrito = [];
  guardarCarrito();
  aviso('Compra realizada');
};
$('btnVaciarCarrito').onclick = () => { carrito = []; guardarCarrito(); };
$('btnCerrarModal').onclick = () => $('modal').hidden = true;
$('modal').addEventListener('click', e => { if (e.target.id === 'modal') $('modal').hidden = true; });
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('modal').hidden = true; });
['buscarProducto','filtroCategoria','filtroLaboratorio'].forEach(id => $(id).addEventListener(id === 'buscarProducto' ? 'input' : 'change', renderProductos));
$('btnLimpiarFiltros').onclick = () => { ['buscarProducto','filtroCategoria','filtroLaboratorio'].forEach(id => $(id).value = ''); renderProductos(); };
renderCarrito();
Promise.allSettled([cargarProductos(),llenarFiltro('filtroCategoria',listarCategorias,'categorías'),llenarFiltro('filtroLaboratorio',listarLaboratorios,'laboratorios'),cargarPromociones()]);
