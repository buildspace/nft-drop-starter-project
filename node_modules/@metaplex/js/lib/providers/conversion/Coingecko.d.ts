import { ConversionRateProvider, Currency, ConversionRatePair } from './ConversionRateProvider';
export declare class Coingecko implements ConversionRateProvider {
    static translateCurrency(currency: Currency): string;
    getRate(from: Currency | Currency[], to: Currency | Currency[]): Promise<ConversionRatePair[]>;
}
