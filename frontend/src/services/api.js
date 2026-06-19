import axios from 'axios'

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api' })

// attach token to every request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// ── Silent token refresh on 401 ──────────────────────────────────────
let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error)
        else prom.resolve(token)
    })
    failedQueue = []
}

api.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config

        // Only attempt refresh on 401, and only once per request
        if (err.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(err)
        }

        // If another request is already refreshing, queue this one
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            }).then(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                return api(originalRequest)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            const token = localStorage.getItem('token')
            if (!token) throw new Error('No token')

            const { data } = await axios.post(
                `${api.defaults.baseURL}/auth/refresh`,
                { token }
            )

            localStorage.setItem('token', data.token)
            processQueue(null, data.token)

            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${data.token}`
            return api(originalRequest)
        } catch {
            // Refresh failed — clear queue but DO NOT auto-logout
            // The user stays logged in until they press "Sair"
            processQueue(err, null)
            return Promise.reject(err)
        } finally {
            isRefreshing = false
        }
    }
)
