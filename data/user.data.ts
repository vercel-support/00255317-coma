'use server'
import { CustomError } from "@/lib/custom-error.class"
import { db } from "@/lib/db"
import { ResServer } from "@/lib/types"
import { TEmployee, TUser } from "@/schemas"
import { UserRole } from "@prisma/client"


export const getUserByEmail = async (email: string) => {

    try {
        if (!email) {
            throw new Error('Email is required')
        }
        const user = await db.user.findUnique({
            where: { email }
        })
        return user

    } catch (error) {
        console.log('[GET_USER_BY_EMAIL]', { error })
        return null
    }

}

export const getUserById = async (id: string) => {
    try {

        if (!id) {
            throw new Error('Id es requerido')
        }

        const user = await db.user.findUnique({
            where: { id },
            include: {
                notifications: {
                    take: 10,
                },
                creditSales: {
                    take: 10,
                    include: {
                        transaction: {
                            include: {
                                productSaleTransaction: true
                            }
                        }
                    }
                },
                employee: {
                    include: {
                        transactions: {
                            take: 10,
                            include: {
                                productSaleTransaction: true
                            }

                        }
                    }
                }
            }
        })

        if (!user) {
            throw new Error('Usuario no encontrado')
        }

        return user
    } catch (error) {
        console.log('[GET_USER_BY_ID]', { error })
        return null
    }
}

export const getUsers = async (): Promise<ResServer<TUser[]>> => {
    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                isTwoFactorEnabled: true,
                role: true,
                permission: true,
            },
        });
        if (!users) {
            throw new CustomError('No se encontraron usuarios', 404)
        }
        return {
            error: false,
            message: 'Usuarios encontrados correctamente',
            data: users as TUser[],
            code: 200
        }
    } catch (error) {
        console.log('[GET_USERS]', { error })
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                data: [],
                code: error.code
            }
        }
        return {
            error: true,
            message: 'Error al buscar los usuarios',
            data: [],
            code: 500
        }
    }
}

export const getEmployees = async (): Promise<ResServer<TEmployee[]>> => {
    try {
        const employees = await db.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                isTwoFactorEnabled: true,
                role: true,
                permission: true,
            },
        });
        employees.sort((a, b) => {
            if (a.role === UserRole.ADMIN) {
                return -1;
            }
            if (b.role === UserRole.ADMIN) {
                return 1;
            }
            if (a.role === UserRole.USER && b.role === UserRole.CLIENT) {
                return -1;
            }
            if (a.role === UserRole.CLIENT && b.role === UserRole.USER) {
                return 1;
            }
            return 0;
        });

        if (!employees) {
            throw new CustomError('No se encontraron empleados', 404)
        }
        return {
            error: false,
            message: 'Empleados encontrados correctamente',
            data: employees as TEmployee[],
            code: 200
        }
    } catch (error) {
        console.log('[GET_EMPLOYEES]', { error })
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                data: [],
                code: error.code
            }
        }

        return {
            error: true,
            message: 'Error al buscar los empleados',
            data: [],
            code: 500
        }
    }
}

export const getAllUsers = async () => {
    try {
        const users = await db.user.findMany();
        return users
    } catch (error) {
        console.log('[GET_ALL_USERS]', { error })
        return null
    }
}