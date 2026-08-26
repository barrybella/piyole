import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopsComponent } from './shops.component';
import { ShoppingComponent } from './shopping/shopping.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { ProductsListeComponent } from './products-liste/products-liste.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ResultRecherchByShopIdComponent } from './result-recherch-by-shop-id/result-recherch-by-shop-id.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { BasketListingComponent } from './basket-listing/basket-listing.component';

const routes: Routes = [
  { path: 'shops', component: ShopsComponent },
  { path: 'shopping', component: ShoppingComponent, data: { title: 'Achetez des Matériaux de Construction partout en Guinée Conakry'} },
  { path: 'products-liste', component: ProductsListeComponent },
  { path: 'get-corbeil-shops', component: ProductsListeComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'basket-listing', component: BasketListingComponent },
  { path: 'detail-product/:id', component: DetailProductComponent },
  { path: 'result-recherch-by-shop-id/:id', component: ResultRecherchByShopIdComponent },
  { path: 'update-product/:id', component: UpdateProductComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopsRoutingModule { }
