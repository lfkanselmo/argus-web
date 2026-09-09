import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { PriceAlert } from '../models/price-alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/alerts`;

  list(): Observable<PriceAlert[]> {
    return this.http.get<PriceAlert[]>(this.baseUrl);
  }
}
