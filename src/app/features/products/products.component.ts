import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

import { CartService } from '../cart/cart.service';
import { PricingRule } from '../../shared/models/pricing.model';
import { PricingService } from '../../shared/services/pricing.service';
import { ProductService } from '../../shared/services/product.service';

import {
  isOfferActiveNow,
  isOfferExpiredNow,
} from '../../shared/utils/offer-date.utils';
import { EurCurrencyPipe } from '../../shared/pipes/eur-currency-.pipe';

type SortMode = 'all' | 'with-offer' | 'without-offer';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  imports: [CommonModule, RouterModule, DatePipe, EurCurrencyPipe],
})
export class ProductsComponent implements OnInit, OnDestroy {

  private readonly destroyRef = inject(DestroyRef);
  private lastAddedTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly allProducts$ = new BehaviorSubject<PricingRule[]>([]);
  readonly sortMode$ = new BehaviorSubject<SortMode>('all');
  readonly currentPage$ = new BehaviorSubject<number>(1);

  readonly pageSize = 6;

  readonly selectedQuantities$ =
    new BehaviorSubject<Record<string, number>>({});

  readonly lastAddedSku$ = new BehaviorSubject<string | null>(null);

  readonly quantityOptions = [1, 2, 3, 4, 5, 10];

  readonly totalProducts$ = this.allProducts$.pipe(
    map((products) => products.length)
  );

  readonly filteredProducts$ = combineLatest([
    this.allProducts$,
    this.sortMode$,
  ]).pipe(
    map(([products, mode]) => {
      if (mode === 'with-offer') {
        return products.filter(
          (p) => p.offer && !isOfferExpiredNow(p.offer)
        );
      }

      if (mode === 'without-offer') {
        return products.filter(
          (p) => !p.offer || isOfferExpiredNow(p.offer)
        );
      }

      return products;
    })
  );

  readonly totalPages$ = this.filteredProducts$.pipe(
    map((products) =>
      Math.max(1, Math.ceil(products.length / this.pageSize))
    )
  );

  readonly visibleProducts$ = combineLatest([
    this.filteredProducts$,
    this.currentPage$,
  ]).pipe(
    map(([products, page]) => {
      const start = (page - 1) * this.pageSize;
      return products.slice(start, start + this.pageSize);
    })
  );

 get cartCount(): number {
  return this.cartService.items.length;
}

  constructor(
    private readonly pricingService: PricingService,
    public readonly productService: ProductService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    this.pricingService.loadPricing()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rules) => {
        this.allProducts$.next(rules);

        const initial: Record<string, number> = {};
        for (const p of rules) {
          initial[p.sku] = 1;
        }
        this.selectedQuantities$.next(initial);
      });
  }

  ngOnDestroy(): void {
    if (this.lastAddedTimer !== null) {
      clearTimeout(this.lastAddedTimer);
    }
  }

  setSortMode(mode: SortMode) {
    this.sortMode$.next(mode);
    this.currentPage$.next(1);
  }

  changePage(step: number) {
    this.currentPage$.next(this.currentPage$.getValue() + step);
  }

  getQuantity(sku: string): number {
    return this.selectedQuantities$.getValue()[sku] ?? 1;
  }

  onQuantityChange(sku: string, value: number | string) {
    const qty = Number(value);

    this.selectedQuantities$.next({
      ...this.selectedQuantities$.getValue(),
      [sku]: qty,
    });
  }

  add(sku: string) {
    const qty = this.getQuantity(sku);

    for (let i = 0; i < qty; i++) {
      this.cartService.scan(sku);
    }

    this.lastAddedSku$.next(sku);
    if (this.lastAddedTimer !== null) clearTimeout(this.lastAddedTimer);
    this.lastAddedTimer = setTimeout(() => this.lastAddedSku$.next(null), 1100);
  }

  isOfferActive(p: PricingRule): boolean {
    return isOfferActiveNow(p.offer);
  }

  isOfferExpired(p: PricingRule): boolean {
    return isOfferExpiredNow(p.offer);
  }

  trackBySku(_: number, item: PricingRule) {
    return item.sku;
  }
}
