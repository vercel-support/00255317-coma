import { PrivateRoute, PublicRoute } from "./lib/routes"


/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {String[]}
*/
export const publicRoutes: string[] = [
    PublicRoute.HOME.href,
    PublicRoute.CONFIRM.href,
]


/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to /settings.
 * @type {String[]}
*/
export const authRoutes: string[] = [
    PublicRoute.LOGIN.href,
    PublicRoute.REGISTER.href,
    PublicRoute.ERROR.href,
    PublicRoute.FORGOT_PASSWORD.href,
    PublicRoute.RESET_PASSWORD.href,
]

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix will be used for authentication purposes.
 * @type {String}
 */
export const apiAuthPrefix: string = PublicRoute.API_AUTH.href



/**
 * The default redirect path after a successful login.
 * @type {String}
 */
export const DEFAULT_LOGIN_REDIRECT: string = PrivateRoute.DASHBOARD.href
