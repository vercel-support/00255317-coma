import { UserRole } from "@prisma/client"
import { type DefaultSession } from "next-auth"
import { TCreditSale, TEmployee, TNotification } from "./schemas"

export type ExtendedUser = DefaultSession["user"] & {
    id: string,
    role: UserRole,
    isTwoFactorEnabled: boolean,
    isOAuth: boolean,
    permission: boolean,
    employeeId?: string,
    notifications?: TNotification[],
    creditSales?: TCreditSale[],
    employee?: TEmployee
}

declare module 'next-auth' {
    interface Session {
        user: ExtendedUser
    }
}