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

export interface DateRange {
    startDate: Date;
    endDate: Date;
}
