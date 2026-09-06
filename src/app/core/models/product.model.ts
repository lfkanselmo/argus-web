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

export interface CreateProductRequest {
  url: string;
  name?: string;
  targetPrice?: number;
}

export interface UpdateProductRequest {
  targetPrice?: number;
  active?: boolean;
}
