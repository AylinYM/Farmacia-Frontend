import { get } from "../api/httpClient.js";

const ENDPOINT = "/promociones";

export async function listarPromociones() {
    return await get(ENDPOINT);
}