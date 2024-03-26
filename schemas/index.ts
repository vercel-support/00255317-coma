import { CashFlow, CashFlowType, PaymentMethod, Transaction, TransactionType, UserRole, Category, Supplier, Product, Warehouse, ProductSaleTransaction, DeliveryStatus, StatusPayment, CashReconsiliation, Expense, ExpenseType, ExpenseFrequency, Settings, CurrencyType, LocaleType, Notification, NotificationType, CreditSale } from '@prisma/client';
import * as z from 'zod';
//IMPORTANT: When you change a schema, you must modify the corresponding model in: @/models/[model_name_here]

const PlaceholderNotificationSchema: z.Schema<Notification> = z.lazy(() => NotificationSchema);
const PlaceholderCreditSaleSchema: z.Schema<CreditSale> = z.lazy(() => CreditSaleSchema);
//** Auth START */
export const UserSchema = z.object({
    email: z.string().email({
        message: 'Por favor ingresa un correo válido',
    }),
    password: z.string().min(6, {
        message: 'Mínimo 6 caracteres',
    }).optional(),
    name: z.string().min(1, {
        message: 'Por favor ingresa un nombre',
    }),
    emailVerified: z.date().optional(),
    image: z.string().optional(),
    acepTerms: z.boolean().optional(),
    permission: z.boolean(),
    notifications: z.array(PlaceholderNotificationSchema).optional(),
    creditSales: z.array(PlaceholderCreditSaleSchema).optional(),
    id: z.string().optional(),
    role: z.nativeEnum(UserRole).optional(),
});

export type TUser = z.infer<typeof UserSchema>;

export const LoginSchema = UserSchema.omit({
    name: true,
    emailVerified: true,
    acepTerms: true,
    image: true,
    permission: true,
}).extend({
    password: z.string().min(6, {
        message: 'Por favor ingresa una contraseña válida',
    }),
    code: z.optional(z.string().min(6, {
        message: 'Por favor ingresa un código válido',
    })),
});;
export type TLogin = z.infer<typeof LoginSchema>;

export const RegisterSchema = UserSchema.omit({
    emailVerified: true,
    image: true,
    permission: true,
})

export const ResetSchema = UserSchema.omit({
    name: true,
    emailVerified: true,
    acepTerms: true,
    image: true,
    password: true,
})
export type TReset = z.infer<typeof ResetSchema>;

export const NewPasswordSchema = UserSchema.omit({
    name: true,
    emailVerified: true,
    acepTerms: true,
    image: true,
    email: true,
})
export type TNewPassword = z.infer<typeof NewPasswordSchema>;
export type TRegister = z.infer<typeof RegisterSchema>;


export const AccountSchema = z.object({
    userId: z.string().optional(),
    type: z.string(),
    provider: z.string(),
    providerAccountId: z.string(),
    refresh_token: z.string().optional(),
    access_token: z.string().optional(),
    expires_at: z.number().optional(),
    token_type: z.string().optional(),
    scope: z.string().optional(),
    id_token: z.string().optional(),
    session_state: z.string().optional(),
});

export type TAccount = z.infer<typeof AccountSchema>;

//** Auth END */

//** REST MODELS */

const PlaceholderCategorySchema: z.Schema<Category> = z.lazy(() => CategorySchema);
const PlaceholderWarehouseSchema: z.Schema<Warehouse> = z.lazy(() => WarehouseSchema);
const PlaceholderProductSchema: z.Schema<Product> = z.lazy(() => ProductSchema);
const PlaceholderCashFlowSchema: z.Schema<CashFlow> = z.lazy(() => CashFlowSchema);
const PlaceholderSupplierSchema: z.Schema<Supplier> = z.lazy(() => SupplierSchema);
const PlaceholderProductSaleTransactionSchema: z.Schema<ProductSaleTransaction> = z.lazy(() => ProductSaleTransactionSchema);
const PlaceholderCashReconsiliationSchema: z.Schema<CashReconsiliation> = z.lazy(() => CashReconsiliationSchema);
const placeholderExpenseSchema: z.Schema<Expense> = z.lazy(() => ExpenseSchema);
const PlaceholderSaleTransactionSchema: z.Schema<Transaction> = z.lazy(() => TransactionSchema);

export const SettingsUserSchema = z.object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email({
        message: 'Por favor ingresa un correo válido',
    })),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),

    password: z.optional(z.string().min(6, {
        message: 'Mínimo 6 caracteres',
    })),
    newPassword: z.optional(z.string().min(6, {
        message: 'Mínimo 6 caracteres',
    })),
})
    .refine((data) => {
        if (data.password && !data.newPassword) {
            return false
        }
        return true
    }, {
        message: 'La nueva contraseña es requerida',
        path: ['newPassword']
    })
    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false
        }
        return true
    }, {
        message: 'La contraseña actual es requerida',
        path: ['password']
    });

export type TSettingsUser = z.infer<typeof SettingsUserSchema>


//** SaleTransaction */
export const TransactionSchema = z.object({
    id: z.string(),
    employeeId: z.string(),
    employee: z.any(),
    productsId: z.array(z.string()),
    products: z.array(PlaceholderProductSchema).optional(),
    transactionType: z.nativeEnum(TransactionType),
    totalAmount: z.number().min(1, {
        message: 'El monto total es requerido',
    }),
    description: z.string().nullable(),
    createdAt: z.date(),
    cashFlowId: z.string().nullable(),
    cashFlow: PlaceholderCashFlowSchema.optional(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    deliveryStatus: z.nativeEnum(DeliveryStatus),
    statusPayment: z.nativeEnum(StatusPayment),
    supplierId: z.string().nullable(),
    supplier: PlaceholderSupplierSchema.optional(),
    productSaleTransaction: z.array(PlaceholderProductSaleTransactionSchema).optional(),
    cashReconsiliationId: z.string().nullable(),
    cashReconsiliation: PlaceholderCashReconsiliationSchema.optional(),
    expenseId: z.string().nullable(),
    expense: placeholderExpenseSchema.optional(),
    creditSale: PlaceholderCreditSaleSchema.optional(),
});
export type TTransaction = z.infer<typeof TransactionSchema>;
export const NewTransactionSchema = TransactionSchema.omit({
    id: true,
    employee: true,
    products: true,
    cashFlow: true,
    cashFlowId: true,
});
export type TNewTransaction = z.infer<typeof NewTransactionSchema>;

//** CashFlow */
export const CashFlowSchema = z.object({
    id: z.string(),
    amount: z.number(),
    description: z.string().nullable(),
    type: z.nativeEnum(CashFlowType),
    createdAt: z.date(),
    transactionId: z.string(),
    transaction: TransactionSchema.optional(),
});
export type TCashFlow = z.infer<typeof CashFlowSchema>;
export const NewCashFlowSchema = CashFlowSchema.omit({
    id: true,
    transaction: true,
});
export type TNewCashFlow = z.infer<typeof NewCashFlowSchema>;

//** Employee */
export const EmployeeSchema = z.object({
    id: z.string(),
    name: z.optional(z.string()),
    email: z.optional(z.string().email({
        message: 'Por favor ingresa un correo válido',
    })),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.nativeEnum(UserRole),
    permission: z.boolean(),
    transactions: z.array(TransactionSchema).optional(),
})
export type TEmployee = z.infer<typeof EmployeeSchema>
export const ChangePermissionSchema = z.object({
    userId: z.string(),
    permission: z.boolean(),
})
export type TChangePermission = z.infer<typeof ChangePermissionSchema>

export const ChangeRoleSchema = z.object({
    userId: z.string(),
    role: z.enum([UserRole.ADMIN, UserRole.USER, UserRole.CLIENT]),
})
export type TChangeRole = z.infer<typeof ChangeRoleSchema>

//* Category */
export const CategorySchema = z.object({
    id: z.string(),
    name: z.string().min(1, {
        message: 'Por favor ingresa un nombre para la categoría',
    }),
    description: z.string().nullable(),
    productsId: z.array(z.string()),
    products: z.array(PlaceholderProductSchema).optional(),
});
export type TCategory = z.infer<typeof CategorySchema>;
export const NewCategorySchema = CategorySchema.omit({
    id: true,
    productsId: true,
});
export type TNewCategory = z.infer<typeof NewCategorySchema>;


//** Supplier */
export const SupplierSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    description: z.string().nullable(),
    productsId: z.array(z.string()),
    products: z.array(PlaceholderProductSchema).optional(),
    transactionsId: z.array(z.string()),
    transactions: z.array(PlaceholderSaleTransactionSchema).optional(),

});
export type TSupplier = z.infer<typeof SupplierSchema>;
export const NewSupplierSchema = SupplierSchema.omit({
    id: true,
    productsId: true,
    products: true,
    transactions: true,
    transactionsId: true,
});
export type TNewSupplier = z.infer<typeof NewSupplierSchema>;

//** Product */
export const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    image: z.string().nullable(),
    purchasePrice: z.coerce.number().min(0.01, "El precio del producto es requerido"),
    price: z.coerce.number().min(0.01, "El precio del producto es requerido"),
    stock: z.coerce.number().min(0, "El stock del producto es requerido"),
    supplierId: z.string(),
    categoryId: z.string(),
    warehouseId: z.string(),
    transactionsId: z.array(z.string()),
    transactions: z.array(TransactionSchema).optional(),
    supplier: PlaceholderSupplierSchema.optional(),
    category: PlaceholderCategorySchema.optional(),
    warehouse: PlaceholderWarehouseSchema.optional(),
});
export type TProduct = z.infer<typeof ProductSchema>;
export const NewProductSchema = ProductSchema.omit({
    id: true,
    transactionsId: true,
});
export type TNewProduct = z.infer<typeof NewProductSchema>;

//** Warehouse */
export const WarehouseSchema = z.object({
    id: z.string(),
    name: z.string(),
    location: z.string(),
    description: z.string().nullable(),
    productsId: z.array(z.string()),
    products: z.array(PlaceholderProductSchema).optional(),
});
export type TWarehouse = z.infer<typeof WarehouseSchema>;
export const NewWarehouseSchema = WarehouseSchema.omit({
    id: true,
    productsId: true,
    products: true,
});
export type TNewWarehouse = z.infer<typeof NewWarehouseSchema>;

//** ProductSaleTransaction */
export const ProductSaleTransactionSchema = z.object({
    id: z.string(),
    productId: z.string(),
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
    totalAmount: z.number(),
    createdAt: z.date(),
    transactionId: z.string(),
    transaction: TransactionSchema.optional(),
});
export type TProductSaleTransaction = z.infer<typeof ProductSaleTransactionSchema>;
export const NewProductSaleTransactionSchema = ProductSaleTransactionSchema.omit({
    id: true,
    transaction: true,
    createdAt: true,
    transactionId: true,
});
export type TNewProductSaleTransaction = z.infer<typeof NewProductSaleTransactionSchema>;

//** CashReconsiliation */
export const CashReconsiliationSchema = z.object({
    id: z.string(),
    amount: z.number(),
    description: z.string().nullable(),
    startDay: z.date(),
    endDay: z.date().nullable(),
    startCash: z.number(),
    endCash: z.number().nullable(),
    isOpen: z.boolean(),
    transactions: z.array(TransactionSchema).optional(),
});
export type TCashReconsiliation = z.infer<typeof CashReconsiliationSchema>;
export const NewCashReconsiliationSchema = CashReconsiliationSchema.omit({
    id: true,
    transactions: true,
});
export type TNewCashReconsiliation = z.infer<typeof NewCashReconsiliationSchema>;

//** Expense */
export const ExpenseSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    amount: z.number().min(0.01, { 'message': 'El monto es requerido' }),
    recurring: z.boolean(),
    type: z.nativeEnum(ExpenseType),
    frequency: z.nativeEnum(ExpenseFrequency),
    createdAt: z.date(),
    updatedAt: z.date(),
    lastPurchaseDate: z.date().nullable(),
    transactions: z.array(TransactionSchema).optional(),
});
export type TExpense = z.infer<typeof ExpenseSchema>;
export const NewExpenseSchema = ExpenseSchema.omit({
    id: true,
    transactions: true,
}).extend({
    typeTransaction: z.nativeEnum(TransactionType),
    paymentMethod: z.nativeEnum(PaymentMethod),
    statusPayment: z.nativeEnum(StatusPayment),
    employeeId: z.string(),
})
export type TNewExpense = z.infer<typeof NewExpenseSchema>;


//** Settings */
export const SettingsSchema = z.object({
    id: z.string(),
    currencyType: z.nativeEnum(CurrencyType),
    localeType: z.nativeEnum(LocaleType),
    cashReserves: z.number(),
});
export type TSettings = z.infer<typeof SettingsSchema>;
export const NewSettingsSchema = SettingsSchema.omit({
    id: true,
});
export type TNewSettings = z.infer<typeof NewSettingsSchema>;
export const NewCashReserverSchema = z.object({
    id: z.string(),
    cashLiquid: z.number().min(0.01, { 'message': 'El monto es requerido' }),
})
export type TNewCashReserver = z.infer<typeof NewCashReserverSchema>;


//** Notification */
export const NotificationSchema = z.object({
    id: z.string(),
    userId: z.string(),
    type: z.nativeEnum(NotificationType),
    title: z.string(),
    message: z.string(),
    link: z.string(),
    read: z.boolean(),
    createdAt: z.date(),
    user: UserSchema.optional(),
});
export type TNotification = z.infer<typeof NotificationSchema>;
export const NewNotificationSchema = NotificationSchema.omit({
    id: true,
    user: true,
    userId: true,
});
export type TNewNotification = z.infer<typeof NewNotificationSchema>;

//** CreditSale */
export const CreditSaleSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    userId: z.string(),
    user: UserSchema.optional(),
    transactionId: z.string(),
    transaction: TransactionSchema.optional(),
});
export type TCreditSale = z.infer<typeof CreditSaleSchema>;
export const NewCreditSaleSchema = CreditSaleSchema.omit({
    id: true,
    transaction: true,
});
export type TNewCreditSale = z.infer<typeof NewCreditSaleSchema>;
//** Assert Types */
function assertTypesAreCompatible(): void {
    const assertTypeWarehouse: Warehouse = {} as TWarehouse;
    const assertTypeProduct: Product = {} as TProduct;
    const assertTypeSupplier: Supplier = {} as TSupplier;
    const assertTypeCategory: Category = {} as TCategory;
    const assertTypeCashFlow: CashFlow = {} as TCashFlow;
    const assertTypeSaleTransaction: Transaction = {} as TTransaction;
    const assertTypeProductSaleTransaction: ProductSaleTransaction = {} as TProductSaleTransaction;
    const assertTypeCashReconsiliation: CashReconsiliation = {} as TCashReconsiliation;
    const assertTypeExpense: Expense = {} as TExpense;
    const assertTypeSettings: Settings = {} as TSettings;
    const assertTypeNotification: Notification = {} as TNotification;
    const assertTypeCreditSale: CreditSale = {} as TCreditSale;
}