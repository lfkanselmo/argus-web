import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { PriceHistoryPoint } from '../models/price-history-point.model';
import { CreateProductRequest, Product, UpdateProductRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/products`;

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  history(id: number): Observable<PriceHistoryPoint[]> {
    return this.http.get<PriceHistoryPoint[]>(`${this.baseUrl}/${id}/history`);
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, request);
  }

  update(id: number, request: UpdateProductRequest): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, request);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
