import { get } from "../api/httpClient.js";

const ENDPOINT = "/categorias";

export async function listarCategorias() {
    return await get(ENDPOINT);
}