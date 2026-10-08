import {
    get,
    post,
    put,
    remove
} from "../api/httpClient.js";

import {
    Producto
} from "../models/producto.js";

const ENDPOINT = "/farmacia";

export async function listarProductos() {
    const data = await get(ENDPOINT);
    const lista = Array.isArray(data) ? data : [];

    return lista.map(
        producto => new Producto(producto)
    );
}

export async function obtenerProducto(id) {
    const data = await get(`${ENDPOINT}/${id}`);
    return new Producto(data);
}

export async function crearProducto(producto) {
    const data = await post(ENDPOINT, producto);
    return new Producto(data);
}

export async function actualizarProducto(id, producto) {
    const data = await put(`${ENDPOINT}/${id}`, producto);
    return new Producto(data);
}

export async function eliminarProducto(id) {
    return await remove(`${ENDPOINT}/${id}`);
}
