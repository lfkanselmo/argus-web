export type ScrapeStatus = 'OK' | 'NETWORK_ERROR' | 'PARSE_ERROR';

export interface PriceHistoryPoint {
  price: number | null;
  status: ScrapeStatus;
  scrapedAt: string;
}
