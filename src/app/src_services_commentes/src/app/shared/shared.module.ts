import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { ShowPlansComponent } from './../posts/show-plans/show-plans.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShowPostsComponent } from './../posts/show-posts/show-posts.component';
import { RouterModule } from '@angular/router';
import { LeftNavComponent } from './../left-nav/left-nav.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ShowProductsComponent } from '../shops/show-products/show-products.component';
// import { ShowShopsComponent } from '../shops/show-shops/show-shops.component';

@NgModule({
  declarations: [
    NavBarComponent,
    LeftNavComponent,
    ShowPostsComponent,
    ShowPlansComponent,
    ShowProductsComponent,
    // ShowShopsComponent
  ],
  exports: [
    NavBarComponent,
    LeftNavComponent,
    ShowPostsComponent,
    ShowPlansComponent,
    ShowProductsComponent,
    // ShowShopsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    ShimmerModule
  ]
})
export class SharedModule { }
