import { Appointment, CurrencyType, Employee, LocaleType, SalesMetrics, Service, ServiceTransaction, Settings, SettingsAccount, User, UserRole, NotificationType, Notification, StatusAppointment } from '@prisma/client';
import * as z from 'zod';
//IMPORTANT: When you change a schema, you must modify the corresponding model in: @/models/[model_name_here]
const PlaceholderSettingsAccountSchema: z.Schema<SettingsAccount> = z.lazy(() => SettingsAccountSchema);
const PlaceholderServiceTransactionSchema: z.Schema<ServiceTransaction> = z.lazy(() => ServiceTransactionSchema);
const PlaceholderServiceSchema: z.Schema<Service> = z.lazy(() => ServiceSchema);
const PlaceholderAppointmentSchema: z.Schema<Appointment> = z.lazy(() => AppointmentSchema);
const PlaceholderEmployeeSchema: z.Schema<Employee> = z.lazy(() => EmployeeSchema);
const PlaceholderNotificationSchema: z.Schema<Notification> = z.lazy(() => NotificationSchema)
const PlaceholderSettingsSchema: z.Schema<Settings> = z.lazy(() => SettingsSchema);
const PlaceholderSalesMetricsSchema: z.Schema<SalesMetrics> = z.lazy(() => SalesMetricsSchema)


//** Auth START */
export const UserSchema = z.object({
    id: z.string(),
    email: z.string(),
    password: z.string(),
    name: z.string(),
    lastName: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    province: z.string(),
    country: z.string(),
    postalCode: z.string(),
    emailVerified: z.date(),
    image: z.string().nullable(),
    permission: z.boolean(),
    role: z.nativeEnum(UserRole),
    acepTerms: z.boolean(),
    isTwoFactorEnabled: z.boolean(),
    //twoFactorConfirmation: z.any().nullable(),
    // accounts: z.any(),
    employeeId: z.string().nullable(),
    employee: PlaceholderEmployeeSchema.optional(),
    notifications: z.array(PlaceholderNotificationSchema).optional(),
    appointments: z.array(PlaceholderAppointmentSchema).optional(),

    serviceTransactions: z.array(PlaceholderServiceTransactionSchema).optional(),
    settings: z.array(PlaceholderSettingsAccountSchema).optional()

});

export type TUser = z.infer<typeof UserSchema>;

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


export const LoginSchema = z.object({
    email: z.optional(z.string().email({
        message: 'Por favor ingresa un correo válido',
    })),
    password: z.optional(z.string().min(6, {
        message: 'Mínimo 6 caracteres',
    })),
    code: z.optional(z.string().min(6, {
        message: 'Por favor ingresa un código válido',
    })),
})
export type TLogin = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email({
        message: 'Por favor ingresa un correo válido',
    })),
    password: z.optional(z.string().min(6, {
        message: 'Mínimo 6 caracteres',
    })),
    aceptTerms: z.boolean()
})

export const ResetSchema = z.object({
    email: z.optional(z.string().email({
        message: 'Por favor ingresa un correo válido',
    })),
})
export type TReset = z.infer<typeof ResetSchema>;

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: 'Mínimo 6 caracteres',
    }),
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

//** SettingsAccount */
export const SettingsAccountSchema = z.object({
    id: z.string(),

    firstSetup: z.boolean(),

    sector: z.string(),
    localName: z.string(),
    localAddress: z.string(),
    localPhone: z.string(),
    localEmail: z.string(),
    localPostalCode: z.string(),
    localCity: z.string(),
    localProvince: z.string(),
    localCountry: z.string(),
    localeType: z.nativeEnum(LocaleType),
    cash_register: z.boolean(),
    credit_card: z.boolean(),
    debit_card: z.boolean(),
    mercado_pago: z.boolean(),
    pay_pal: z.boolean(),
    currencyType: z.nativeEnum(CurrencyType),
    cashReserves: z.coerce.number().min(0.01, "El monto es requerido"),

    // notifications
    notificationsExpense: z.boolean(),
    notificationsCreditsSale: z.boolean(),
    // relations
    userId: z.string().nullable(),
    user: UserSchema.optional(),
    serviceTransactionId: z.string().nullable(),
    serviceTransaction: PlaceholderServiceTransactionSchema.optional(),
})
export type TSettingsAccount = z.infer<typeof SettingsAccountSchema>
export const NewSettingsAccountSchema = SettingsAccountSchema.omit({
    id: true
})
export type TNewSettingsAccount = z.infer<typeof NewSettingsAccountSchema>

//** ServiceTransaction */
export const ServiceTransactionSchema = z.object({
    id: z.string(),
    date: z.date(),
    expirationDate: z.date(),
    history: z.array(z.string()),
    aceptTerms: z.boolean(),
    paymentMethod: z.string(),
    paymentStatus: z.string(),
    status: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    serviceId: z.string().nullable(),
    service: PlaceholderServiceSchema.optional(),
    setings: z.array(PlaceholderSettingsSchema),
    userId: z.string().nullable(),
    user: UserSchema.optional()


})
export type TServiceTransaction = z.infer<typeof ServiceTransactionSchema>
export const NewServiceTransactionSchema = ServiceTransactionSchema.omit({
    id: true
})
export type TNewServiceTransaction = z.infer<typeof NewServiceTransactionSchema>


//** Service */
export const ServiceSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.coerce.number().min(0.01, "El precio es requerido"),
    priceIdStripe: z.string(),
    currencyType: z.nativeEnum(CurrencyType),
    localeType: z.nativeEnum(LocaleType),
    duration: z.coerce.number().min(1, "El tiempo en minutos es requerido."),
    online: z.boolean(),
    discount: z.coerce.number().min(0.01).nullable(),
    percentageCommission: z.coerce.number().min(0).nullable(),
    commission: z.coerce.number().min(0.01).nullable(),
    appointments: z.array(PlaceholderAppointmentSchema).optional(),
    serviceTransaction: z.array(PlaceholderServiceTransactionSchema).optional()
})
export type TService = z.infer<typeof ServiceSchema>
export const NewServiceSchema = ServiceSchema.omit({
    id: true
})
export type TNewService = z.infer<typeof NewServiceSchema>

//** Appointment */
export const AppointmentSchema = z.object({
    id: z.string(),
    date: z.date(),
    status: z.nativeEnum(StatusAppointment),
    userId: z.string(),
    employeeId: z.string(),
    serviceId: z.string(),
    user: UserSchema.optional(), // Este campo es opcional ya que en el modelo Prisma no es obligatorio para la relación
    employee: PlaceholderEmployeeSchema.optional(), // Igual que arriba
    service: ServiceSchema.optional() // Igual que arriba
})
export type TAppointment = z.infer<typeof AppointmentSchema>
export const NewAppointmentSchema = AppointmentSchema.omit({
    id: true
})
export type TNewAppointment = z.infer<typeof NewAppointmentSchema>

//** AppointmentForm */
export const AppoinmentFormSchema = z.object({
    name: z.string(),
    coupleName: z.string(),
    email: z.string(),
    phone: z.string(),
    situation: z.string(),
    message: z.string(),
})
export type TAppointmentForm = z.infer<typeof AppoinmentFormSchema>
//** Employee */
export const EmployeeSchema = z.object({
    id: z.string(),
    position: z.string(),
    userId: z.string(),
    user: UserSchema,
    appointments: z.array(AppointmentSchema).optional(),
})
export type TEmployee = z.infer<typeof EmployeeSchema>

//** Notification */
export const NotificationSchema = z.object({
    id: z.string(),
    notificationType: z.nativeEnum(NotificationType),
    title: z.string(),
    message: z.string(),
    link: z.string(),
    userId: z.string().nullable(),
    user: UserSchema.nullable(),
    read: z.boolean(),
    createdAt: z.date(),
});
export type TNotification = z.infer<typeof NotificationSchema>;
export const NewNotificationSchema = NotificationSchema.omit({
    id: true,
    user: true,
    userId: true,
});
export type TNewNotification = z.infer<typeof NewNotificationSchema>;

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



//** SalesMetrics */
export const SalesMetricsSchema = z.object({
    id: z.string(),
    totalSales: z.coerce.number().min(0),
    totalRevenue: z.coerce.number().min(0.01),
    totalCostOperational: z.coerce.number().min(0.01),
    totalCommission: z.coerce.number().min(0.01),
    netProfit: z.coerce.number().min(0.01),
    marketingBudget: z.coerce.number().min(0.01),
    conversionRate: z.coerce.number().min(0.01),
    roi: z.coerce.number().min(0.01),
    createdAt: z.date()
})
export type TSalesMetrics = z.infer<typeof SalesMetricsSchema>
export const NewSalesMetricsSchema = SalesMetricsSchema.omit({})
export type TNewSalesMetrics = z.infer<typeof NewSalesMetricsSchema>


export const ChangePermissionSchema = z.object({
    userId: z.string(),
    permission: z.boolean(),
})
export type TChangePermission = z.infer<typeof ChangePermissionSchema>

export const ChangeRoleSchema = z.object({
    userId: z.string(),
    role: z.enum([UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT]),
})
export type TChangeRole = z.infer<typeof ChangeRoleSchema>




export const NewCashReserverSchema = z.object({
    id: z.string(),
    cashLiquid: z.number().min(0.01, { 'message': 'El monto es requerido' }),
})
export type TNewCashReserver = z.infer<typeof NewCashReserverSchema>;





//** Assert Types */
function assertTypesAreCompatible(): void {

    const assertTypeUser: User = {} as TUser;
    const assertTypeSettingsAccount: SettingsAccount = {} as TSettingsAccount;
    const assertTypeServiceTransaction: ServiceTransaction = {} as TServiceTransaction;
    const assertTypeSaleService: Service = {} as TService;
    const assertTypeAppointment: Appointment = {} as TAppointment;
    const assertTypeEmployee: Employee = {} as TEmployee;
    const assertTypeNotification: Notification = {} as TNotification;
    const assertTypeSettings: Settings = {} as TSettings;
    const assertTypeSalesMetrics: SalesMetrics = {} as TSalesMetrics;
}