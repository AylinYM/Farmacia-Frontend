import { get, post, put, remove } from "../api/httpClient.js";

const ENDPOINT = "/categorias";

export async function listarCategorias() {
    return await get(ENDPOINT);
}

export async function obtenerCategoria(id) {
    return await get(`${ENDPOINT}/${id}`);
}

export async function crearCategoria(categoria) {
    return await post(ENDPOINT, categoria);
}

export async function actualizarCategoria(id, categoria) {
    return await put(`${ENDPOINT}/${id}`, categoria);
}

export async function eliminarCategoria(id) {
    return await remove(`${ENDPOINT}/${id}`);
}