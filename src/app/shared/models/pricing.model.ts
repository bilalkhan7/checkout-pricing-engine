export interface Offer {
  quantity: number;
  price: number;
  validFrom?: string;
  validTo?: string;
}

export interface PricingRule {
  sku: string;
  name: string;
  unitPrice: number;
  offer?: Offer;
}

export type PricingTable = Record<string, PricingRule>;

export interface CheckoutTotals {
  subtotal: number;
  discount: number;
  total: number;
}

export const DEFAULT_PRICING_TABLE: PricingTable = {
  Apple: {
    sku: 'Apple',
    name: 'Apple',
    unitPrice: 30,
    offer: {
      quantity: 2,
      price: 45,
      validFrom: '2026-04-21',
      validTo: '2026-04-27',
    },
  },
  Banana: {
    sku: 'Banana',
    name: 'Banana',
    unitPrice: 50,
    offer: {
      quantity: 3,
      price: 130,
      validFrom: '2026-04-22',
      validTo: '2026-04-28',
    },
  },
  Peach: {
    sku: 'Peach',
    name: 'Peach',
    unitPrice: 20,
  },
  Kiwi: {
    sku: 'Kiwi',
    name: 'Kiwi',
    unitPrice: 18,
  },
  Mango: {
    sku: 'Mango',
    name: 'Mango',
    unitPrice: 10,
    offer: {
      quantity: 4,
      price: 30,
      validFrom: '2026-04-23',
      validTo: '2026-04-29',
    },
  },
  Orange: {
    sku: 'Orange',
    name: 'Orange',
    unitPrice: 5,
  },
  Melon: {
    sku: 'Melon',
    name: 'Melon',
    unitPrice: 7,
  },
  Grapes: {
    sku: 'Grapes',
    name: 'Grapes',
    unitPrice: 8,
    offer: {
      quantity: 5,
      price: 35,
      validFrom: '2026-05-01',
      validTo: '2026-05-07',
    },
  },
  Watermelon: {
    sku: 'Watermelon',
    name: 'Watermelon',
    unitPrice: 60,
  },
  Pomegranate: {
    sku: 'Pomegranate',
    name: 'Pomegranate',
    unitPrice: 30,
    offer: {
      quantity: 3,
      price: 80,
      validFrom: '2026-05-05',
      validTo: '2026-05-11',
    },
  },
  Pineapple: {
    sku: 'Pineapple',
    name: 'Pineapple',
    unitPrice: 25,
  },
  Strawberry: {
    sku: 'Strawberry',
    name: 'Strawberry',
    unitPrice: 6,
    offer: {
      quantity: 4,
      price: 20,
      validFrom: '2026-04-14',
      validTo: '2026-04-21',
    },
  },
};
