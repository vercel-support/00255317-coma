'use server'
import { PrivateRoute } from '@/lib/routes'
import { getUserByEmail, getUserById } from '@/data/user.data'
import { CustomError } from '@/lib/custom-error.class'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/mail'
import { currentUser } from '@/lib/server-auth'
import { generateVerificationToken } from '@/lib/tokens'
import { ResServer } from '@/lib/interfaces'
import { SettingsUserSchema, TSettingsUser, UserSchema } from '@/schemas'
import { UserRole } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { ZodError } from 'zod'

export const authorizeRoles = async (rolesAcepted: UserRole[]): Promise<Boolean> => {
    try {
        const user = await currentUser();
        if (!user) return Promise.resolve(false)
        if (rolesAcepted.includes(user.role)) return Promise.resolve(true)
        return Promise.resolve(false)
    } catch (error) {
        console.log('[AUTHORIZE_ROLES] -> ', error)
        return Promise.resolve(false)
    }
}

export const updateUser = async (values: TSettingsUser): Promise<ResServer> => {
    try {
        SettingsUserSchema.safeParse(values)
        const user = await currentUser()
        if (!user) throw new CustomError('No autorizado', 401)

        const dbUser = await getUserById(user.id!)
        if (!dbUser) throw new CustomError('Usuario no encontrado', 404)

        if (user.isOAuth) {
            values.email = undefined;
            values.password = undefined;
            values.newPassword = undefined;
            values.isTwoFactorEnabled = undefined;
        }

        if (values.email && values.email !== user.email) {
            const existingUser = await getUserByEmail(values.email)
            if (existingUser && existingUser.id !== user.id) throw new CustomError('Email ya en uso', 400)

            const verificationToken = await generateVerificationToken(values.email)
            await sendVerificationEmail(verificationToken.email, verificationToken.token)

            return {
                error: false,
                message: 'Se ha enviado un email de verificación a tu nueva dirección de correo electrónico. Por favor, verifica tu email para continuar.',
                code: 200
            }
        }

        if (values.password && values.newPassword && dbUser.password) {
            const passwordMatch = await bcrypt.compare(values.password, dbUser.password)
            if (!passwordMatch) throw new CustomError('Contraseña incorrecta', 400)
            const hashedPassword = await bcrypt.hash(values.newPassword!, 10)
            values.password = hashedPassword
            values.newPassword = undefined
        }

        await db.user.update({
            where: { id: dbUser.id },
            data: { ...values }
        })

        return {
            error: false,
            message: 'Perfil actualizado con éxito',
            code: 200
        }
    } catch (error) {
        console.log('[SETTINGS_USER_ACTION] -> ', error);
        if (error instanceof ZodError) {
            return {
                error: true,
                message: 'No se pudo actualizar el perfil. Los datos son inválidos o están incompletos.',
                code: 400
            }
        }
        if (error instanceof CustomError) {
            return { error: true, message: error.message, code: error.code }
        }
        return { error: true, message: 'Algo salió mal. Por favor, inténtelo de nuevo.', code: 500 }
    }
}

export async function ChangedPermission({ id, permission }: { id: string, permission: boolean }): Promise<ResServer> {
    try {
        if (!id || permission === undefined) throw new CustomError("Faltan datos.", 400);
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        const user = await db.user.update({
            where: { id },
            data: { permission }
        });

        // Si el usuario es CLIENT y no tiene un empleado asociado, crea uno
        if (user.role !== UserRole.CLIENT && !user.employeeId) {
            const Newemployee = await db.employee.create({
                data: {
                    userId: id,
                }
            })

            await db.user.update({
                where: { id },
                data: {
                    employeeId: Newemployee.id
                }
            })

        }

        revalidatePath(PrivateRoute.USERS.path);
        return {
            data: user,
            message: "Permiso cambiado!",
            error: false,
            code: 200
        };
    } catch (error) {
        console.error('[EMPLOYEE_ACTIONS_CHANGE_PERMISSION]', { error });
        if (error instanceof CustomError) {
            return { message: error.message, error: true, code: error.code };
        }
        return { message: "Error durante el cambio de permiso", error: true, code: 500 };
    }
}

export async function ChangedRole({ id, role }: { id: string, role: UserRole }): Promise<ResServer> {
    try {
        if (!id || !role) throw new CustomError("Faltan datos.", 400);
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado", 401);
        const user = await db.user.update({
            where: { id },
            data: { role }
        });
        // si el role es USER y no tiene un empleado asociado, crea uno
        if (role === UserRole.USER && !user.employeeId) {
            const Newemployee = await db.employee.create({
                data: {
                    userId: id,
                }
            })

            await db.user.update({
                where: { id },
                data: {
                    employeeId: Newemployee.id
                }
            })
        }

        // si el rol es CLIENT y tiene un empleado asociado, eliminarlo
        if (role === UserRole.CLIENT && user.employeeId) {
            await db.employee.delete({
                where: { id: user.employeeId }
            })

            await db.user.update({
                where: { id },
                data: {
                    employeeId: null
                }
            })
        }
        revalidatePath(PrivateRoute.USERS.path);
        return {
            data: user,
            message: "Rol cambiado!",
            error: false,
            code: 200
        };
    } catch (error) {
        console.error('[EMPLOYEE_ACTIONS_CHANGE_ROLE]', { error });
        if (error instanceof CustomError) {
            return { message: error.message, error: true, code: error.code };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return { message: "Error en base de datos durante el cambio de rol", error: true, code: 500 };
        }
        return { message: "Error durante el cambio de rol", error: true, code: 500 };
    }
}


export async function DeleteUser(id: string): Promise<ResServer> {
    try {
        if (!id) throw new CustomError("No se ha proporcionado un ID de usuario.", 400);
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        // Buscar el usuario a eliminar
        const user = await db.user.findUnique({
            where: { id },
            include: { accounts: true }
        });
        if (!user) {
            throw new CustomError("Usuario no encontrado", 404);
        }

        // Verificar si el usuario tiene una cuenta asociada
        const hasAccount = user.accounts.length > 0;

        // Si el usuario tiene una cuenta asociada, eliminarla primero
        if (hasAccount) {
            await db.account.deleteMany({
                where: { userId: id }
            });
        }

        // Eliminar el empleado
        if (user.employeeId) {
            await db.employee.delete({
                where: { id: user.employeeId }
            });
        }

        // Eliminar el usuario
        const deleteUser = await db.user.delete({
            where: { id }
        });

        revalidatePath(PrivateRoute.USERS.path);

        return {
            data: deleteUser,
            message: "Usuario eliminado!",
            error: false,
            code: 200
        };
    } catch (error) {
        console.error('[USER_ACTION_DELETE_USER]', { error });
        if (error instanceof CustomError) {
            return { message: error.message, error: true, code: error.code };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return { message: "Error durante la eliminación del usuario", error: true, code: 500 };
            }
            return { message: "Error en base de datos durante la eliminación del usuario", error: true, code: 500 };
        }
        return { message: "Error desconocido durante la eliminación del usuario", error: true, code: 500 };
    }
}

export async function createUsersTest(): Promise<void> {
    try {
        const usersData = [
            {
                name: 'admin',
                email: 'admin@gmail.com',
                password: '123456',
                permission: true,
                emailVerified: new Date(),
                role: UserRole.ADMIN,
            },
            {
                name: 'empleado',
                email: 'empleado@gmail.com',
                password: '123456',
                permission: true,
                emailVerified: new Date(),
                role: UserRole.USER,
            },
            {
                name: 'cliente 1',
                email: 'cliente1@gmail.com',
                password: '123456',
                permission: true,
                emailVerified: new Date(),
                role: UserRole.CLIENT,
            },
            {
                name: 'cliente 2',
                email: 'cliente2@gmail.com',
                password: '123456',
                permission: false,
                emailVerified: new Date(),
                role: UserRole.CLIENT,
            }
        ];

        const hashedPasswords = await Promise.all(usersData.map(async userData => {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;
            return userData;
        }));

        await db.user.createMany({
            data: hashedPasswords.map(userData => UserSchema.parse(userData))
        });

        const allUsers = await db.user.findMany();

        for (const user of allUsers) {
            if (user.role === UserRole.ADMIN || user.role === UserRole.USER) {
                const Newemployee = await db.employee.create({
                    data: {
                        userId: user.id,
                    }
                });
                await db.user.update({
                    where: { id: user.id },
                    data: {
                        employeeId: Newemployee.id
                    }
                });
            }
        }

        console.log('[USER_ACTIONS] -> Usuarios de prueba creados correctamente.');
    } catch (error) {
        console.error('Error al crear usuarios de prueba:', error);
    }
}
