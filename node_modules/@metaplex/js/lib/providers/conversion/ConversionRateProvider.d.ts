export declare enum Currency {
    USD = "usd",
    EUR = "eur",
    AR = "ar",
    SOL = "sol"
}
export declare type ConversionRatePair = {
    from: Currency;
    to: Currency;
    rate: number;
};
export interface ConversionRateProvider {
    getRate(from: Currency | Currency[], to: Currency | Currency[]): Promise<ConversionRatePair[]>;
}
