// We are keeping an organized enum of all currencies to allow for easier refactoring should
// we decide to change the way that metaplex names currencies internally
export enum Currency {
  USD = 'usd',
  EUR = 'eur',
  AR = 'ar',
  SOL = 'sol',
}

export type ConversionRatePair = {
  from: Currency;
  to: Currency;
  rate: number;
};

export interface ConversionRateProvider {
  getRate(from: Currency | Currency[], to: Currency | Currency[]): Promise<ConversionRatePair[]>;
}
