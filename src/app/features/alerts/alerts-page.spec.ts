import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_BASE_URL } from '../../core/config/api.config';
import { AlertsPage } from './alerts-page';

describe('AlertsPage', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertsPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('muestra el estado vacío cuando no hay alertas', async () => {
    const fixture = TestBed.createComponent(AlertsPage);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/alerts`).flush([]);
    httpMock.expectOne(`${API_BASE_URL}/products`).flush([]);
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Todavía no se disparó ninguna alerta');
  });

  it('muestra el nombre del producto resolviendo el productId contra la lista', async () => {
    const fixture = TestBed.createComponent(AlertsPage);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/alerts`).flush([
      {
        id: 1,
        productId: 1,
        reason: 'PRICE_DROP',
        previousPrice: 198000,
        newPrice: 172500,
        triggeredAt: '2026-09-05T00:00:00Z'
      }
    ]);
    httpMock.expectOne(`${API_BASE_URL}/products`).flush([
      {
        id: 1,
        url: 'https://articulo.mercadolibre.com.co/MCO-1',
        name: 'Guantes moto Suomy',
        targetPrice: 180000,
        siteKey: 'mercadolibre',
        active: true,
        createdAt: new Date().toISOString(),
        lastPrice: 172500,
        lastCheckedAt: new Date().toISOString()
      }
    ]);
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Guantes moto Suomy');
    expect(text).toContain('Bajó de precio');
  });
});
