import type { Currency } from "@/types";

// Exchange rates (refresh from API in production)
const EXCHANGE_RATES: Record<Currency, number> = {
    LKR: 1,
    USD: 0.0033, // 1 LKR = ~0.0033 USD
    EUR: 0.0030, // 1 LKR = ~0.003 EUR
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
    LKR: "Rs.",
    USD: "$",
    EUR: "€",
};

const CURRENCY_LABELS: Record<Currency, string> = {
    LKR: "Sri Lankan Rupee",
    USD: "US Dollar",
    EUR: "Euro",
};

export function convertCurrency(
    amountLKR: number,
    targetCurrency: Currency
): number {
    return parseFloat((amountLKR * EXCHANGE_RATES[targetCurrency]).toFixed(2));
}

export function formatCurrency(amount: number, currency: Currency): string {
    const symbol = CURRENCY_SYMBOLS[currency];

    if (currency === "LKR") {
        return `${symbol} ${amount.toLocaleString("en-LK", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    }

    return `${symbol}${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export function getCurrencySymbol(currency: Currency): string {
    return CURRENCY_SYMBOLS[currency];
}

export function getCurrencyLabel(currency: Currency): string {
    return CURRENCY_LABELS[currency];
}

export const CURRENCIES: Currency[] = ["USD", "LKR", "EUR"];
