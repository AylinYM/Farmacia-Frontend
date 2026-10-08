// Cambia solamente esta URL si tu profesor te entrego otro endpoint.
const API_BASE_URL =
    "https://farmacia-6sdu.onrender.com/api";

export async function request(endpoint = "", options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            let errorMessage = `Error HTTP ${response.status}`;

            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // La respuesta puede no tener contenido JSON.
            }

            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return null;
        }

        const text = await response.text();

        if (!text) {
            return null;
        }

        return JSON.parse(text);

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

export function get(endpoint = "") {
    return request(endpoint, { method: "GET" });
}

export function post(endpoint, data) {
    return request(endpoint, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export function put(endpoint, data) {
    return request(endpoint, {
        method: "PUT",
        body: JSON.stringify(data)
    });
}

export function remove(endpoint) {
    return request(endpoint, { method: "DELETE" });
}
