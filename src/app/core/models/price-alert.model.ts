export type AlertReason = 'PRICE_DROP' | 'PARSE_FAILURE';

export interface PriceAlert {
  id: number;
  productId: number;
  reason: AlertReason;
  previousPrice: number | null;
  newPrice: number | null;
  triggeredAt: string;
}
