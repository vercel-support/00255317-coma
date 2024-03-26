import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CurrencyType } from "./interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (
  amount: number,
  currency: CurrencyType
): string => {
  let currencyType = 'ARS';
  let localeType = 'es-AR';
  switch (currency) {
    case CurrencyType.Dólares:
      currencyType = 'USD';
      localeType = 'en-US';
      break;
    case CurrencyType.Euro:
      currencyType = 'EUR';
      localeType = 'es-ES';
      break;
    case CurrencyType.PesoArgentino:
      currencyType = 'ARS';
      localeType = 'es-AR';
      break;
    case CurrencyType.Shekels:
      currencyType = 'ILS';
      localeType = 'he-IL';
      break;
    default:
      currencyType = 'ARS';
      localeType = 'es-AR';
  }
  currencyType = currencyType;
  localeType = localeType;



  if (!amount) {
    const amountNull = 0;
    return amountNull.toLocaleString(localeType, {
      style: "currency",
      currency: currencyType,
    });

  }
  return amount.toLocaleString(localeType, {
    style: "currency",
    currency: currencyType,
  });
};