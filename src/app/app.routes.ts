import { Routes } from '@angular/router';
import { AlertsPage } from './features/alerts/alerts-page';
import { ProductsPage } from './features/products/products-page';
import { ProductTrendPage } from './features/trend/product-trend-page';

export const routes: Routes = [
  { path: '', component: ProductsPage },
  { path: 'products/:id', component: ProductTrendPage },
  { path: 'alerts', component: AlertsPage },
  { path: '**', redirectTo: '' }
];
