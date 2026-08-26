import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopsRoutingModule } from './shops-routing.module';
import { ShopsComponent } from './shops.component';
import { ShoppingComponent } from './shopping/shopping.component';
import { SharedModule } from '../shared/shared.module';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { ProductsListeComponent } from './products-liste/products-liste.component';
import { AddProductComponent } from './add-product/add-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ResultRecherchByShopIdComponent } from './result-recherch-by-shop-id/result-recherch-by-shop-id.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { ConfirmPasswordDeleteProductComponent } from './confirm-password-delete-product/confirm-password-delete-product.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AddBasketComponent } from './add-basket/add-basket.component';
import { BasketListingComponent } from './basket-listing/basket-listing.component';
import { DeleteBasketComponent } from './delete-basket/delete-basket.component';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShowShopsComponent } from './show-shops/show-shops.component';
import { AddDetailsComponent } from './add-details/add-details.component';
import { UpdateDetailsComponent } from './update-details/update-details.component';
import { GetCorbeilShopsComponent } from './get-corbeil-shops/get-corbeil-shops.component';

// Module de fonctionnalité "shops" : regroupe l'ensemble du parcours e-commerce
// (catalogue, détail produit, gestion produit CRUD, panier, corbeille) ainsi que
// l'affichage des boutiques.
@NgModule({
  declarations: [
    ShopsComponent,
    ShoppingComponent,
    DetailProductComponent,
    ProductsListeComponent,
    AddProductComponent,
    ResultRecherchByShopIdComponent,
    UpdateProductComponent,
    ConfirmPasswordDeleteProductComponent,
    AddBasketComponent,
    BasketListingComponent,
    DeleteBasketComponent,
    ShowShopsComponent,
    AddDetailsComponent,
    UpdateDetailsComponent,
    GetCorbeilShopsComponent,
    // ShowProductsComponent  
  ],
  imports: [
    CommonModule,
    ShopsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule,
    NgxPaginationModule,
    SharedModule,
    ShimmerModule,
    FontAwesomeModule
  ]
})
export class ShopsModule { }
