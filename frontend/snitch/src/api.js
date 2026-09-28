import axios from 'axios'

const env = import.meta.env

export const API_ENDPOINTS = {
    auth: {
        register: env.VITE_API_AUTH_REGISTER || '/api/auth/register',
        login: env.VITE_API_AUTH_LOGIN || '/api/auth/login',
        logout: env.VITE_API_AUTH_LOGOUT || '/api/auth/logout',
        me: env.VITE_API_AUTH_ME || '/api/auth/me',
        refresh: env.VITE_API_AUTH_REFRESH || '/api/auth/refresh',
    },
    products: {
        list: env.VITE_API_PRODUCTS_LIST || '/api/products/get',
        byId: (id) => `${env.VITE_API_PRODUCTS_BY_ID || '/api/products/get'}/${id}`,
        create: env.VITE_API_PRODUCTS_CREATE || '/api/products/create',
        update: (id) => `${env.VITE_API_PRODUCTS_UPDATE || '/api/products/update'}/${id}`,
        remove: (id) => `${env.VITE_API_PRODUCTS_DELETE || '/api/products/delete'}/${id}`,
    },
}

export const apiClient = axios.create({
    baseURL: env.DEV ? '' : (env.VITE_API_URL || ''),
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