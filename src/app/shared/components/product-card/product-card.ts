import { Component, computed, input } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { Card } from '../card/card';

@Component({
  selector: 'app-product-card',
  imports: [Card],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard {
  product = input.required<Product>();
  previousPrice = input<number | null>(null);

  protected readonly siteMonogram = computed(() => this.buildMonogram(this.product().siteKey));
  protected readonly siteLabel = computed(() => this.buildSiteLabel(this.product().siteKey));

  protected readonly deltaLabel = computed(() => {
    const previous = this.previousPrice();
    const current = this.product().lastPrice;
    if (previous == null || current == null || previous === 0) {
      return null;
    }
    const percent = ((current - previous) / previous) * 100;
    const rounded = Math.abs(percent).toFixed(1).replace('.', ',');
    return `${percent < 0 ? '−' : '+'}${rounded}%`;
  });

  protected readonly lastCheckedLabel = computed(() => {
    const iso = this.product().lastCheckedAt;
    if (!iso) {
      return 'Sin revisar todavía';
    }
    const hours = Math.round((Date.now() - new Date(iso).getTime()) / 3_600_000);
    if (hours < 1) {
      return 'hace menos de 1 h';
    }
    if (hours < 24) {
      return `hace ${hours} h`;
    }
    return `hace ${Math.round(hours / 24)} d`;
  });

  protected formatPrice(value: number | null): string {
    return value == null ? '—' : '$' + new Intl.NumberFormat('es-CO').format(value);
  }

  private buildMonogram(siteKey: string): string {
    return siteKey
      .split('-')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  private buildSiteLabel(siteKey: string): string {
    return siteKey
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
