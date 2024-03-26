/**
 * Similares a Hooks pero para servir desde el servidor
 */
import { auth } from "@/auth"

export const currentUser = async () => {
    try {
        const session = await auth()
        if (!session) throw new Error('No hay sesión activa')
        return session.user
    } catch (error) {
        console.log('[SERVER_AUTH_CURRENT_USER] -> ', error)
        return Promise.resolve(null)
    }
}

export const currentRole = async () => {
    try {
        const session = await auth()
        if (!session) throw new Error('No hay sesión activa')
        return session.user.role
    } catch (error) {
        console.log('[SERVER_AUTH_CURRENT_ROLE] -> ', error)
        return Promise.resolve(null)
    }
}