import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { Button } from '../../shared/components/button/button';
import { InputField } from '../../shared/components/input-field/input-field';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-products-page',
  imports: [Button, InputField, ProductCard],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss'
})
export class ProductsPage {
  private readonly productService = inject(ProductService);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly loadError = signal<string | null>(null);

  protected readonly urlValue = signal('');
  protected readonly nameValue = signal('');
  protected readonly targetPriceValue = signal('');
  protected readonly creating = signal(false);
  protected readonly formError = signal<string | null>(null);

  constructor() {
    this.loadProducts();
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submit();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.productService.list().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('No se pudo cargar la lista de productos. ¿Está corriendo argus-api?');
        this.loading.set(false);
      }
    });
  }

  private submit(): void {
    const url = this.urlValue().trim();
    if (!url) {
      this.formError.set('La URL del producto es obligatoria.');
      return;
    }
    this.formError.set(null);
    this.creating.set(true);

    const targetPriceRaw = this.targetPriceValue().trim();
    const targetPrice = targetPriceRaw ? Number(targetPriceRaw) : undefined;

    this.productService
      .create({ url, name: this.nameValue().trim() || undefined, targetPrice })
      .subscribe({
        next: (product) => {
          this.products.update((current) => [product, ...current]);
          this.urlValue.set('');
          this.nameValue.set('');
          this.targetPriceValue.set('');
          this.creating.set(false);
        },
        error: (error: unknown) => {
          this.creating.set(false);
          this.formError.set(this.describeError(error));
        }
      });
  }

  protected togglePause(product: Product): void {
    this.productService.update(product.id, { active: !product.active }).subscribe({
      next: (updated) => this.replaceProduct(updated),
      error: () => this.loadError.set('No se pudo actualizar el producto.')
    });
  }

  protected deleteProduct(product: Product): void {
    this.productService.remove(product.id).subscribe({
      next: () => this.products.update((current) => current.filter((item) => item.id !== product.id)),
      error: () => this.loadError.set('No se pudo eliminar el producto.')
    });
  }

  private replaceProduct(updated: Product): void {
    this.products.update((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }

  private describeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const backendMessage = (error.error as { message?: string } | null)?.message;
      if (backendMessage) {
        return backendMessage;
      }
    }
    return 'No se pudo trackear el producto. Intentá de nuevo.';
  }
}
