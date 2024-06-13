export const PrivateRoute: { [key: string]: TRoute } = {
    DASHBOARD: {
        title: "Dashboard",
        path: "/dashboard",
        href: "/dashboard",
    },
    CONSULTINGS: {
        title: "Asesorias",
        path: "/consultings",
        href: "/consultings",
    },
    CONSULTING: {
        title: "Asesoria",
        path: "/consultings/:consultingId",
        href: "/consultings/",
    },

    STATISTICS: {
        title: "Estadísticas",
        path: "/statistics",
        href: "/statistics",
    },

    USERS: {
        title: "Usuarios",
        path: "/users",
        href: "/users",
    },
    USER: {
        title: "Usuario",
        path: "/users/:userId",
        href: "/users/",
    },
    SETTINGS: {
        title: "Ajustes",
        path: "settings",
        href: "settings",
    },
    CASH_MANAGEMENT: {
        title: "Finanzas",
        path: "cash-management",
        href: "cash-management",
    },
    PROFILE: {
        title: "Perfil",
        path: '/profile',
        href: '/profile',
    },

}

export const PublicRoute: { [key: string]: TRoute } = {
    HOME: {
        title: "Inicio",
        path: "/",
        href: "/",
    },
    CONFIRM: {
        title: "Confirmar",
        path: "/auth/new-verification?token=${token}",
        href: "/auth/new-verification",
    },
    LOGIN: {
        title: "Entrar",
        path: "/auth/login",
        href: "/auth/login",
    },
    ERROR: {
        title: "Error",
        path: "/auth/error",
        href: "/auth/error",
    },
    REGISTER: {
        title: "Registro",
        path: "/auth/register",
        href: "/auth/register",
    },
    FORGOT_PASSWORD: {
        title: "Recuperar contraseña",
        path: "/auth/reset",
        href: "/auth/reset",
    },
    API_AUTH: {
        title: "API Auth",
        path: "/api/auth",
        href: "/api/auth",
    },
    RESET_PASSWORD: {
        title: "Restablecer contraseña",
        path: "/auth/new-password?token=${token}",
        href: "/auth/new-password",
    },
    POLICY: {
        title: 'Política de Privacidad',
        path: '/policy',
        href: '/policy'
    },
    TERMS: {
        title: 'Terminos y Condiciones',
        path: '/terms',
        href: '/terms'
    },
    COOKIES: {
        title: 'Política de Cookies',
        path: '/cookies',
        href: '/cookies'
    },
    US: {
        title: '¿Quienes somos?',
        path: '/us',
        href: '/us'
    },
    CONTACT: {
        title: 'Contacto',
        path: '/contact',
        href: '/contact'
    }
}
