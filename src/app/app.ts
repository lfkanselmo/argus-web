import { Component, signal } from '@angular/core';
import { Button } from './shared/components/button/button';
import { InputField } from './shared/components/input-field/input-field';
import { SelectField, SelectOption } from './shared/components/select-field/select-field';
import { ProductCard } from './shared/components/product-card/product-card';
import { Product } from './core/models/product.model';

@Component({
  selector: 'app-root',
  imports: [Button, InputField, SelectField, ProductCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly siteOptions: SelectOption[] = [
    { value: 'mercadolibre', label: 'MercadoLibre' },
    { value: 'books-to-scrape-test', label: 'Books to Scrape (prueba)' }
  ];

  protected readonly urlValue = signal('');
  protected readonly siteValue = signal('mercadolibre');

  protected readonly demoProduct: Product = {
    id: 1,
    url: 'https://articulo.mercadolibre.com.co/MCO-1334109057-guantes-moto-suomy-100-impermeables-originales-touch-tactil-_JM',
    name: 'Guantes moto Suomy 100% impermeables, touch táctil',
    targetPrice: 180000,
    siteKey: 'mercadolibre',
    active: true,
    createdAt: new Date().toISOString(),
    lastPrice: 172500,
    lastCheckedAt: new Date(Date.now() - 3 * 3_600_000).toISOString()
  };

  protected readonly pausedProduct: Product = {
    ...this.demoProduct,
    id: 2,
    name: 'Casco integral Shoei GT-Air II',
    active: false,
    targetPrice: null,
    lastPrice: 890000,
    lastCheckedAt: new Date(Date.now() - 26 * 3_600_000).toISOString()
  };
}
