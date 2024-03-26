'use server'

import { PrivateRoute } from "@/lib/routes";
import { CustomError } from "@/lib/custom-error.class";
import { db } from "@/lib/db";
import { ResServer } from "@/lib/interfaces";
import { ProductSchema, TNewProduct, TProduct } from "@/schemas";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { authorizeRoles } from "./user.action";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

interface PropsProductNewI {
    values: TNewProduct;
    path: string;
}
export const createProduct = async ({ values, path }: PropsProductNewI): Promise<ResServer<TProduct | null>> => {
    try {
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);
        const productExist = await db.product.findFirst({
            where: {
                name: values.name,
            },
        });
        if (productExist) {
            return {
                error: true,
                message: "Ya existe un producto con este nombre",
                code: 400,
                data: null,
            };
        }
        const product = await db.product.create({
            data: {
                name: values.name,
                description: values.description,
                price: values.price,
                purchasePrice: values.purchasePrice,
                stock: values.stock,
                supplierId: values.supplierId,
                categoryId: values.categoryId,
                warehouseId: values.warehouseId,
            },
            include: {
                supplier: true,
                category: true,
                warehouse: true,
            },
        });

        await db.warehouse.update({
            where: {
                id: values.warehouseId,
            },
            data: {
                productsId: {
                    push: product.id,
                },
            },
        });
        await db.category.update({
            where: {
                id: values.categoryId,
            },
            data: {
                productsId: {
                    push: product.id,
                },
            },
        });
        await db.supplier.update({
            where: {
                id: values.supplierId,
            },
            data: {
                productsId: {
                    push: product.id,
                },
            },
        });


        revalidatePath(path);
        revalidatePath(PrivateRoute.WAREHOUSES.href);
        revalidatePath(PrivateRoute.CATEGORIES.href);
        revalidatePath(PrivateRoute.SUPPLIERS.href);
        return {
            error: false,
            message: "Producto creado correctamente",
            code: 201,
            data: product as TProduct,
        };
    } catch (error) {
        console.log("[CREATE_PRODUCT]", error);
        if (error instanceof ZodError) {
            return {
                error: true,
                code: 400,
                message: error.issues.map((issue) => issue.message).join("\n \n"),
            };
        }
        return {
            error: true,
            message: "Error al crear el producto",
            code: 500,
            data: null,
        };
    }
}


export async function updateProduct(
    values: TProduct
): Promise<ResServer<TProduct>> {


    try {

        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado.", 401);
        const { id, ...updateValues } = ProductSchema.parse(values);

        const productId = id.toString()

        const product = await db.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                warehouse: true,
                category: true,
                supplier: true,
            },

        });

        if (!product) throw new CustomError("Producto no encontrado", 404);

        // si cambio el id del almacen o la categoria se debe actualizar la referencia
        if (product.warehouseId !== updateValues.warehouseId) {
            await db.warehouse.update({
                where: {
                    id: product.warehouseId,
                },
                data: {
                    productsId: {
                        set: product.warehouse.productsId.filter(productId => productId !== product.id),
                    },
                },
            });
        }
        if (product.categoryId !== updateValues.categoryId) {
            await db.category.update({
                where: {
                    id: product.categoryId,
                },
                data: {
                    productsId: {
                        set: product.category.productsId.filter(productId => productId !== product.id),
                    },
                },
            });
        }
        if (product.supplierId !== updateValues.supplierId) {
            await db.supplier.update({
                where: {
                    id: product.supplierId,
                },
                data: {
                    productsId: {
                        set: product.supplier.productsId.filter(productId => productId !== product.id),
                    },
                },
            });
        }

        await db.product.update({
            where: {
                id: productId,
            },
            data: {
                ...updateValues,
                category: undefined,
                warehouse: undefined,
                supplier: undefined,
                transactions: undefined
            },
        });

        // actualizar la referencia del productSaleTransaction
        await db.productSaleTransaction.updateMany({
            where: {
                productId: productId
            },
            data: {
                productId: productId,
                name: updateValues.name,
            }
        });

        revalidatePath(PrivateRoute.PRODUCTS.href);

        return {
            error: false,
            message: "Producto actualizado correctamente",
            code: 200,
        };
    } catch (error) {
        console.log("[UPDATE_PRODUCT]", { error });
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
                message: "Error en la base de datos al actualizar el producto",
                code: 500,
            };
        }
        return {
            error: true,
            message: "Error al actualizar el producto",
            code: 500,
        };
    }
}


export async function deleteProduct(id: string): Promise<ResServer> {

    try {
        const authorization = await authorizeRoles([UserRole.ADMIN]);
        if (!authorization) throw new CustomError("No autorizado", 401);
        const product = await db.product.findUnique({
            where: {
                id,
            },
            include: {
                warehouse: true,
                category: true,
                supplier: true,
            },
        });
        if (!product) throw new CustomError("Producto no encontrado", 404);

        // Eliminar la referencia del producto eliminado de la categoría
        await db.category.update({
            where: {
                id: product.categoryId,
            },
            data: {
                productsId: {
                    set: product.category.productsId.filter(productId => productId !== product.id),
                },
            },
        });

        // Eliminar la referencia del producto eliminado del almacén
        await db.warehouse.update({
            where: {
                id: product.warehouseId,
            },
            data: {
                productsId: {
                    set: product.warehouse.productsId.filter(productId => productId !== product.id),
                },
            },
        });

        // Eliminar la referencia del producto eliminado del proveedor
        await db.supplier.update({
            where: {
                id: product.supplierId,
            },
            data: {
                productsId: {
                    set: product.supplier.productsId.filter(productId => productId !== product.id),
                },
            },
        });

        // Elimina el producto.
        await db.product.delete({
            where: {
                id,
            },
        });

        return {
            error: false,
            message: "Producto eliminado correctamente",
            code: 200,
        };
    } catch (error) {
        console.log("[DELETE_PRODUCT]", { error });

        if (error instanceof CustomError) {
            return {
                error: true,
                code: 401,
                message: error.message,
            };
        }
        return {
            error: true,
            message: "Error al eliminar el producto",
            code: 500,
        };
    }
}