import { get, post, put, remove } from "../api/httpClient.js";

const ENDPOINT = "/laboratorios";

export async function listarLaboratorios() {
    return await get(ENDPOINT);
}

export async function obtenerLaboratorio(id) {
    return await get(`${ENDPOINT}/${id}`);
}

export async function crearLaboratorio(laboratorio) {
    return await post(ENDPOINT, laboratorio);
}

export async function actualizarLaboratorio(id, laboratorio) {
    return await put(`${ENDPOINT}/${id}`, laboratorio);
}

export async function eliminarLaboratorio(id) {
    return await remove(`${ENDPOINT}/${id}`);
}