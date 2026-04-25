import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { CartService } from './features/cart/cart.service';

const checkoutGuard = () => {
  const cart = inject(CartService);
  const router = inject(Router);
  return cart.items.length > 0 ? true : router.createUrlTree(['/products']);
};

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products.component')
        .then(c => c.ProductsComponent),
  },
  {
    path: 'checkout',
    canActivate: [checkoutGuard],
    loadComponent: () =>
      import('./features/checkout/checkout.component')
        .then(c => c.CheckoutComponent),
  },
  {
    path: '**',
    redirectTo: 'products',
  }
];