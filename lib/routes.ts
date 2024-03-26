export const PrivateRoute: { [key: string]: TRoute } = {
    DASHBOARD: {
        title: "Dashboard",
        path: "/dashboard",
        href: "/dashboard",
    },
    PRODUCTS: {
        title: "Productos",
        path: "/products",
        href: "/products",
    },
    PRODUCT: {
        title: "Producto",
        path: "/products/:productId",
        href: "/products/",
    },
    CATEGORIES: {
        title: "Categorías",
        path: "/products-categories",
        href: "/products-categories/",
    },
    CATEGORY: {
        title: "Categoría",
        path: "/products-categories/:categoryId",
        href: "/products-categories/",
    },
    STATISTICS: {
        title: "Estadísticas",
        path: "/statistics",
        href: "/statistics",
    },
    SUPPLIERS: {
        title: "Proveedores",
        path: "/suppliers",
        href: "/suppliers",
    },
    SUPPLIER: {
        title: "Proveedor",
        path: "/suppliers/:supplierId",
        href: "/suppliers/",
    },
    SUPPLIERS_ORDERS: {
        title: "Pedidos Proveedores",
        path: "/suppliers-orders",
        href: "/suppliers-orders/",
    },
    SUPPLIER_ORDER: {
        title: "Hacer pedido a Proveedor",
        path: "/suppliers-orders/:supplierId",
        href: "/suppliers-orders/",
    },
    ORDER_SUPPLIER: {
        title: "Pedido Proveedor",
        path: "/suppliers-orders/order/:orderId",
        href: "/suppliers-orders/order/",
    },
    WAREHOUSES: {
        title: "Almacenes",
        path: "/warehouses",
        href: "/warehouses",
    },
    WAREHOUSE: {
        title: "Almacén",
        path: "/warehouses/:warehouseId",
        href: "/warehouses/",
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
    EXPENSES: {
        title: "Gastos",
        path: "cash-management/expenses",
        href: "cash-management/expenses",
    },
    EXPENSE: {
        title: "Gasto",
        path: "cash-management/expenses/:expenseId",
        href: "cash-management/expenses/",
    },
    // Rutas externas
    TPV: {
        title: "TPV",
        path: `${process.env.NEXT_PUBLIC_TPV_URL}/tpv`,
        href: `${process.env.NEXT_PUBLIC_TPV_URL}/tpv`,
    },
    PROFILE: {
        title: "Perfil",
        path: `${process.env.NEXT_PUBLIC_TPV_URL}profile`,
        href: `${process.env.NEXT_PUBLIC_TPV_URL}profile`,
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
}
