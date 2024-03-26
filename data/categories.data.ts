'use server'
import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/types";
import { TCategory } from "@/schemas";


export async function getCategoryById(
    id: string
): Promise<ResServer<TCategory | null>> {
    try {
        if (id === "new") return {
            error: false,
            message: "Nueva categoría",
            code: 200,
            data: null,
        };

        const category = await db.category.findUnique({
            where: {
                id,
            },
            include: {
                products: true,
            },

        });
        if (!category) throw new CustomError("Categoría no encontrada", 404);
        return {
            error: false,
            message: "Categoría encontrada correctamente",
            code: 200,
            data: category as TCategory,
        };
    } catch (error) {
        console.error('[GET_CATEGORY_BY_ID] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
                data: null,
            };
        }
        return {
            error: true,
            message: "Error al buscar la categoría",
            code: 500,
            data: null,
        };
    }
}


export async function getCategories(): Promise<ResServer<TCategory[]>> {
    try {
        const categories = await db.category.findMany({
            include: {
                products: true,
            },
        });
        if (!categories) throw new CustomError("No se encontraron categorías", 404);
        return {
            error: false,
            message: "Categorías encontradas correctamente",
            code: 200,
            data: categories as TCategory[],
        };
    } catch (error) {
        console.error('[GET_CATEGORIES] ', { error });
        if (error instanceof CustomError) {
            return {
                error: true,
                message: error.message,
                code: error.code,
                data: [],
            };
        }
        return {
            error: true,
            message: "Error al buscar las categorías",
            code: 500,
            data: [],
        };
    }
}