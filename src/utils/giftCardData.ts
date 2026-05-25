export interface GiftCardAmount {
  BDT: number;
  popular: boolean;
  cardUSD: number;
  discount?: string;
}

export interface GiftCard {
  id: string;
  brand: string;
  title: string;
  image: string;
  currency: string;
  amounts: GiftCardAmount[];
}

export const giftCards: GiftCard[] = [
  {
    id: "amazon-1",
    brand: "amazon",
    title: "Amazon Gift Card",
    image:
      "https://i.ibb.co.com/9kJbv9nd/Nice-Png-amazon-logo-png-transparent-592581.png", // shopping-related image
    currency: "$",
    amounts: [
      { BDT: 500, popular: false, cardUSD: 5 },
      { BDT: 1000, popular: true, cardUSD: 10 },
      { BDT: 1500, popular: false, cardUSD: 15 },
      { BDT: 2000, popular: false, cardUSD: 20 },
    ],
  },
  {
    id: "steam-1",
    brand: "steam",
    title: "Steam Wallet Card",
    image: "https://i.ibb.co.com/ZCxxm0n/stream.png",
    currency: "$",
    amounts: [
      { BDT: 500, popular: false, cardUSD: 5 },
      { BDT: 1000, popular: true, cardUSD: 10 },
      { BDT: 2500, popular: false, cardUSD: 25 },
      { BDT: 5000, popular: false, cardUSD: 50 },
    ],
  },
  {
    id: "playstation-1",
    brand: "playstation",
    title: "PlayStation Store Card",
    image: "https://i.ibb.co.com/twtzVF4J/pngegg.png",
    currency: "$",
    amounts: [
      { BDT: 1000, popular: false, cardUSD: 10 },
      { BDT: 2000, popular: true, cardUSD: 20 },
      { BDT: 5000, popular: false, cardUSD: 50 },
      { BDT: 10000, popular: false, cardUSD: 100 },
    ],
  },
  {
    id: "xbox-1",
    brand: "xbox",
    title: "Xbox Gift Card",
    image: "https://i.ibb.co.com/YF3fN7Lz/pngkey-com-xbox-png-447673.png",
    currency: "$",
    amounts: [
      { BDT: 1000, popular: true, cardUSD: 10 },
      { BDT: 2500, popular: false, cardUSD: 25 },
      { BDT: 5000, popular: false, cardUSD: 50 },
    ],
  },
  {
    id: "google-1",
    brand: "google",
    title: "Google Play Card",
    image:
      "https://i.ibb.co.com/9kJbv9nd/Nice-Png-amazon-logo-png-transparent-592581.png",
    currency: "$",
    amounts: [
      { BDT: 500, popular: false, cardUSD: 5 },
      { BDT: 1000, popular: true, cardUSD: 10 },
      { BDT: 2500, popular: false, cardUSD: 25 },
    ],
  },
  {
    id: "apple-1",
    brand: "apple",
    title: "Apple Gift Card",
    image:
      "https://i.ibb.co.com/9kJbv9nd/Nice-Png-amazon-logo-png-transparent-592581.png",
    currency: "$",
    amounts: [
      { BDT: 1500, popular: false, cardUSD: 15 },
      { BDT: 2500, popular: true, cardUSD: 25 },
      { BDT: 5000, popular: false, cardUSD: 50 },
      { BDT: 10000, popular: false, cardUSD: 100 },
    ],
  },
];
