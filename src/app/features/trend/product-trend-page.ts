import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PriceHistoryPoint } from '../../core/models/price-history-point.model';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { PriceChart } from '../../shared/components/price-chart/price-chart';

@Component({
  selector: 'app-product-trend-page',
  imports: [RouterLink, PriceChart],
  templateUrl: './product-trend-page.html',
  styleUrl: './product-trend-page.scss'
})
export class ProductTrendPage {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  protected readonly product = signal<Product | null>(null);
  protected readonly history = signal<PriceHistoryPoint[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal<string | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      product: this.productService.getById(id),
      history: this.productService.history(id)
    }).subscribe({
      next: ({ product, history }) => {
        this.product.set(product);
        this.history.set(history);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('No se pudo cargar el histórico de este producto.');
        this.loading.set(false);
      }
    });
  }

  protected formatPrice(value: number | null): string {
    return value === null ? '—' : '$' + new Intl.NumberFormat('es-CO').format(value);
  }
}
