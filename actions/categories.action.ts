'use server'

import { PrivateRoute } from "@/constants/routes.constants";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/types";
import { NewCategorySchema, TCategory, TNewCategory } from "@/schemas";
import { revalidatePath } from "next/cache";

import { CustomError } from "@/lib/custom-error.class";
import { UserRole } from "@prisma/client";
import { ZodError } from "zod";
import { authorizeRoles } from "./user.action";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";



export const createCategory = async (data: TNewCategory): Promise<ResServer<TCategory | null>> => {
    try {
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado", 401);

        NewCategorySchema.parse(data);

        const categoryExist = await db.category.findFirst({
            where: {
                name: data.name,
            },
        });
        if (categoryExist) throw new CustomError("Ya existe una categoría con este nombre", 400);

        await db.category.create({
            data: {
                name: data.name,
                description: data.description,
            }
        });
        revalidatePath(PrivateRoute.CATEGORIES.path);

        return {
            error: false,
            message: "Categoría creada",
            code: 201
        };
    } catch (error) {
        console.log("[CREATE_CATEGORY]", { error });
        if (error instanceof ZodError) {
            return {
                error: true,
                code: 400,
                message: error.issues.map((issue) => issue.message).join("\n \n"),
            };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return {
                error: true,
                message: "Error en la base de datos al crear la categoría",
                code: 500,
            };
        }
        if (error instanceof CustomError) {
            return {
                error: true,
                code: 400,
                message: error.message,
            };
        }
        return {
            error: true,
            message: "Error al crear la categoría",
            code: 500,
            data: null,
        };
    }
}

export async function updateCategory(
    values: TCategory
): Promise<ResServer<TCategory>> {


    try {
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado", 401);

        const { id, ...updateData } = values;

        const categoryId = id.toString();

        NewCategorySchema.parse(updateData);

        const existingNameCategory = await db.category.findFirst({
            where: {
                name: updateData.name,
            },
        });
        if (existingNameCategory) throw new CustomError("Ya existe una categoría con ese nombre", 400);

        const category = await db.category.findUnique({
            where: {
                id: categoryId,
            },
        });

        if (!category) throw new CustomError("Categoría no encontrada", 404);

        await db.category.update({
            where: {
                id: categoryId,
            },
            data: {
                name: updateData.name,
                description: updateData.description,
            }
        });

        revalidatePath(PrivateRoute.CATEGORIES.path);

        return {
            error: false,
            message: "Categoría actualizada",
            code: 200,
        };
    } catch (error) {
        console.log("[UPDATE_CATEGORY]", error);
        if (error instanceof ZodError) {
            return {
                error: true,
                code: 400,
                message: error.issues.map((issue) => issue.message).join("\n \n"),
            };
        }
        if (error instanceof CustomError) {
            return {
                error: true,
                code: 401,
                message: error.message,
            };
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return {
                error: true,
                message: "Error en la base de datos al actualizar la categoría",
                code: 500,
            };
        }
        return {
            error: true,
            message: "Error al actualizar la categoría",
            code: 500,
        };
    }
}

export async function deleteCategory(id: string): Promise<ResServer> {

    try {
        if (!id) throw new CustomError("No se ha proporcionado el id de la categoría", 400);
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);

        const category = await db.category.findUnique({
            where: {
                id,
            },
            include: {
                products: true,
            },
        });
        if (!category) throw new CustomError("Categoría no encontrada", 404);
        if (category.products.length > 0)
            throw new CustomError("No se puede eliminar la categoría porque tiene productos asociados", 400);

        await db.category.delete({
            where: {
                id,
            },
        });
        revalidatePath(PrivateRoute.CATEGORIES.path);

        return {
            error: false,
            message: "Categoría eliminada",
            code: 200,
        };
    } catch (error) {
        console.log("[DELETE_CATEGORY]", error);
        if (error instanceof Error) {
            return {
                error: true,
                code: 500,
                message: error.message,
            };
        }
        if (error instanceof CustomError) {
            return {
                error: true,
                code: 401,
                message: error.message,
            };
        }
        return {
            error: true,
            message: "Error al eliminar la categoría",
            code: 500,
        };
    }
}

export async function addProductsToCategory(productsId: string[], categoryId: string) {
    try {
        const category = await db.category.findUnique({
            where: {
                id: categoryId,
            },
        });

        if (!category) throw new CustomError("Categoría no encontrada", 404);

        await db.category.update({
            where: {
                id: categoryId,
            },
            data: {
                productsId: {
                    push: productsId,
                },
            },
        });

        return {
            error: false,
            message: "Productos actualizados en su categoría correctamente",
            code: 200,
        };
    } catch (error) {
        console.log("[UPDATE_PRODUCTS_CATEGORY]", error);
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: 404,
            };
        }
        return {
            error: true,
            message: "Error al actualizar los productos en la categoría",
            code: 500,
        };
    }
}

export async function removeProductsFromCategory(productsId: string[], categoryId: string) {
    try {
        const category = await db.category.findUnique({
            where: {
                id: categoryId,
            },
        });

        if (!category) throw new CustomError("Categoría no encontrada", 404);

        await db.category.update({
            where: {
                id: categoryId,
            },
            data: {
                productsId: {
                    set: category.productsId.filter((productId) => !productsId.includes(productId)),
                },
            },
        });

        return {
            error: false,
            message: "Productos actualizados en su categoría correctamente",
            code: 200,
        };
    } catch (error) {
        console.log("[UPDATE_PRODUCTS_CATEGORY]", error);
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: 404,
            };
        }
        return {
            error: true,
            message: "Error al actualizar los productos en la categoría",
            code: 500,
        };
    }
}