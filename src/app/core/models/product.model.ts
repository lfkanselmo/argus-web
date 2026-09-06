export interface Product {
  id: number;
  url: string;
  name: string | null;
  targetPrice: number | null;
  siteKey: string;
  active: boolean;
  createdAt: string;
  lastPrice: number | null;
  lastCheckedAt: string | null;
}
