import { useState } from 'react'
import { AuthContext } from './auth-context.js'
import { authApi } from './api.js'

function readStoredSession() {
    try {
        return {
            token: localStorage.getItem('snitch.accessToken'),
            user: JSON.parse(localStorage.getItem('snitch.user') || 'null'),
        }
    } catch {
        return { token: null, user: null }
    }
}

function tokenUserId(token) {
    try {
        const encodedPayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        return JSON.parse(atob(encodedPayload)).userId
    } catch {
        return null
    }
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(readStoredSession)

    function saveSession(payload) {
        const nextSession = {
            token: payload.accessToken,
            user: { ...payload.data, id: payload.data?.id || tokenUserId(payload.accessToken) },
        }
        localStorage.setItem('snitch.accessToken', nextSession.token)
        localStorage.setItem('snitch.user', JSON.stringify(nextSession.user))
        setSession(nextSession)
        return nextSession.user
    }

    async function register(formData) {
        return saveSession(await authApi.register(formData))
    }

    async function login(formData) {
        return saveSession(await authApi.login(formData))
    }

    async function logout() {
        try {
            if (session.token) await authApi.logout(session.token)
        } finally {
            localStorage.removeItem('snitch.accessToken')
            localStorage.removeItem('snitch.user')
            setSession({ token: null, user: null })
        }
    }

    return (
        <AuthContext.Provider value={{ ...session, isSeller: session.user?.role === 'seller', login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}