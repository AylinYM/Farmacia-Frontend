import { get, post, put, remove } from "../api/httpClient.js";

const ENDPOINT = "/promociones";

export async function listarPromociones() {
    return await get(ENDPOINT);
}

export async function obtenerPromocion(id) {
    return await get(`${ENDPOINT}/${id}`);
}

export async function crearPromocion(promocion) {
    return await post(ENDPOINT, promocion);
}

export async function actualizarPromocion(id, promocion) {
    return await put(`${ENDPOINT}/${id}`, promocion);
}

export async function eliminarPromocion(id) {
    return await remove(`${ENDPOINT}/${id}`);
}