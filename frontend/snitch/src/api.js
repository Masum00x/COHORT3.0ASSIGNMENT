import axios from 'axios'

export const API_ENDPOINTS = {
    auth: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        me: '/api/auth/me',
        refresh: '/api/auth/refresh',
    },
    products: {
        list: '/api/products/get',
        byId: (id) => `/api/products/get/${id}`,
        create: '/api/products/create',
        update: (id) => `/api/products/update/${id}`,
        remove: (id) => `/api/products/delete/${id}`,
    },
}

export const apiClient = axios.create({
    baseURL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || ''),
    timeout: 12000,
    withCredentials: true,
})

export async function apiRequest(url, { token, ...config } = {}) {
    try {
        const response = await apiClient.request({
            url,
            ...config,
            headers: {
                ...config.headers,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
        return response.data
    } catch (error) {
        const payload = error.response?.data || {}
        const validationMessage = payload.errors
            ?.map((item) => item.msg || item.message)
            .filter(Boolean)
            .join(', ')
        throw new Error(validationMessage || payload.message || payload.messege || error.message || 'Request failed', { cause: error })
    }
}

export const authApi = {
    register: (data) => apiRequest(API_ENDPOINTS.auth.register, { method: 'POST', data }),
    login: (data) => apiRequest(API_ENDPOINTS.auth.login, { method: 'POST', data }),
    logout: (token) => apiRequest(API_ENDPOINTS.auth.logout, { method: 'POST', token }),
    me: (userId, token) => apiRequest(API_ENDPOINTS.auth.me, { method: 'POST', data: { userId }, token }),
}

export const productApi = {
    list: () => apiRequest(API_ENDPOINTS.products.list),
    getById: (id) => apiRequest(API_ENDPOINTS.products.byId(id)),
    create: (formData, token) => apiRequest(API_ENDPOINTS.products.create, { method: 'POST', data: formData, token }),
    update: (id, formData, token) => apiRequest(API_ENDPOINTS.products.update(id), { method: 'PUT', data: formData, token }),
    remove: (id, token) => apiRequest(API_ENDPOINTS.products.remove(id), { method: 'DELETE', token }),
}