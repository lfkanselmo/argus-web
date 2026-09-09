import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { API_BASE_URL } from '../../core/config/api.config';
import { PriceHistoryPoint } from '../../core/models/price-history-point.model';
import { PriceChart } from '../../shared/components/price-chart/price-chart';
import { ProductTrendPage } from './product-trend-page';

@Component({ selector: 'app-price-chart', template: '' })
class PriceChartStub {
  history = input<PriceHistoryPoint[]>([]);
  targetPrice = input<number | null>(null);
}

describe('ProductTrendPage', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTrendPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } }
        }
      ]
    })
      .overrideComponent(ProductTrendPage, {
        remove: { imports: [PriceChart] },
        add: { imports: [PriceChartStub] }
      })
      .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('muestra el precio actual y el objetivo del producto', async () => {
    const fixture = TestBed.createComponent(ProductTrendPage);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/products/1`).flush({
      id: 1,
      url: 'https://articulo.mercadolibre.com.co/MCO-1',
      name: 'Guantes moto Suomy',
      targetPrice: 180000,
      siteKey: 'mercadolibre',
      active: true,
      createdAt: new Date().toISOString(),
      lastPrice: 172500,
      lastCheckedAt: new Date().toISOString()
    });
    httpMock.expectOne(`${API_BASE_URL}/products/1/history`).flush([
      { price: 198000, status: 'OK', scrapedAt: '2026-09-01T00:00:00Z' },
      { price: 172500, status: 'OK', scrapedAt: '2026-09-05T00:00:00Z' }
    ]);
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Guantes moto Suomy');
    expect(text).toContain('172.500');
    expect(text).toContain('180.000');
  });
});
