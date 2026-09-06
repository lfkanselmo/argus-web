import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../core/config/api.config';
import { ProductsPage } from './products-page';

describe('ProductsPage', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('muestra el estado vacío cuando la API no tiene productos', async () => {
    const fixture = TestBed.createComponent(ProductsPage);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/products`).flush([]);
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Todavía no estás trackeando ningún producto');
  });

  it('muestra un mensaje de error si la API no responde', async () => {
    const fixture = TestBed.createComponent(ProductsPage);
    fixture.detectChanges();

    httpMock.expectOne(`${API_BASE_URL}/products`).flush('error', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('No se pudo cargar');
  });

  it('renderiza una tarjeta por cada producto recibido', async () => {
    const fixture = TestBed.createComponent(ProductsPage);
    fixture.detectChanges();

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

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-product-card');
    expect(cards.length).toBe(1);
  });
});
