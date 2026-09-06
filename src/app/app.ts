import { Component } from '@angular/core';
import { ProductsPage } from './features/products/products-page';

@Component({
  selector: 'app-root',
  imports: [ProductsPage],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
