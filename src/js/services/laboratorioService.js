import { get } from "../api/httpClient.js";

const ENDPOINT = "/laboratorios";

export async function listarLaboratorios() {
    return await get(ENDPOINT);
}