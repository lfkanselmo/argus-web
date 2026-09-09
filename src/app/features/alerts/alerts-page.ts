import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AlertReason, PriceAlert } from '../../core/models/price-alert.model';
import { AlertService } from '../../core/services/alert.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-alerts-page',
  imports: [RouterLink],
  templateUrl: './alerts-page.html',
  styleUrl: './alerts-page.scss'
})
export class AlertsPage {
  private readonly alertService = inject(AlertService);
  private readonly productService = inject(ProductService);

  protected readonly alerts = signal<PriceAlert[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal<string | null>(null);

  private productNames = new Map<number, string>();

  constructor() {
    forkJoin({
      alerts: this.alertService.list(),
      products: this.productService.list()
    }).subscribe({
      next: ({ alerts, products }) => {
        this.productNames = new Map(products.map((product) => [product.id, product.name ?? product.url]));
        this.alerts.set(alerts);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('No se pudo cargar el historial de alertas.');
        this.loading.set(false);
      }
    });
  }

  protected productName(productId: number): string {
    return this.productNames.get(productId) ?? `Producto #${productId}`;
  }

  protected reasonLabel(reason: AlertReason): string {
    return reason === 'PRICE_DROP' ? 'Bajó de precio' : 'Fallo de lectura sostenido';
  }

  protected formatPrice(value: number | null): string {
    return value === null ? '—' : '$' + new Intl.NumberFormat('es-CO').format(value);
  }

  protected formatDate(iso: string): string {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
  }
}
