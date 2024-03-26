export interface ResServer<T = any> {
    error: boolean;
    message: string;
    code: number;
    data?: T;
}

export interface ItemMenuAsideAdmin extends TRoute {
    name: string;
    icon?: JSX.Element;
    role?: string[];
}

export enum CurrencyType {
    Euro = "EUR",
    PesoArgentino = "ARS",
    Dólares = "USD",
    Shekels = "ILS",
}

export enum LocaleType {
    Arg = "es-AR",
    EEUU = "en-US",
    Esp = "es-ES",
    Il = "he-IL",
}

export interface DateRange {
    startDate: Date;
    endDate: Date;
}
