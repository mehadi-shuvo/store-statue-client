type TopUpAmount = {
  realCurrency: number;
  gameCurrency: number;
  popular: boolean;
};

export type TTopUpData = {
  id: number | string;
  name: string;
  subHeading: string;
  title: string;
  description: string;
  logo: string;
  banner: string;
  gameCurrencyName: string;
  topUpAmounts: TopUpAmount[];
  priceCurrency?: "USD" | "BDT";
};
