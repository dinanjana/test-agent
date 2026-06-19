const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message)
        this.name = "ApiError"
    }
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText)
        throw new ApiError(res.status, text)
    }
    return res.json() as Promise<T>
}

export const apiClient = {
    get<T>(path: string): Promise<T> {
        return fetch(`${API_BASE}${path}`).then((res) => handleResponse<T>(res))
    },

    post<T>(path: string, body?: unknown): Promise<T> {
        return fetch(`${API_BASE}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }).then((res) => handleResponse<T>(res))
    },

    put<T>(path: string, body?: unknown): Promise<T> {
        return fetch(`${API_BASE}${path}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }).then((res) => handleResponse<T>(res))
    },

    delete<T>(path: string): Promise<T> {
        return fetch(`${API_BASE}${path}`, { method: "DELETE" }).then((res) =>
            handleResponse<T>(res),
        )
    },

    /**
     * Returns the raw Response for streaming / SSE endpoints.
     * The caller is responsible for reading res.body.
     */
    stream(path: string, body?: unknown): Promise<Response> {
        return fetch(`${API_BASE}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        })
    },
}

export { ApiError }
export const apiBase = API_BASE
