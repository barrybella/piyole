import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
import { AddPostComponent } from './add-post/add-post.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { ContactComponent } from './contact/contact.component';
import { DemoMaterialModule } from '../services/material.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MakingContactComponent } from './making-contact/making-contact.component';
import { ContactConfirmListingComponent } from './contact-confirm-listing/contact-confirm-listing.component';
import { OnConfirmContactComponent } from './on-confirm-contact/on-confirm-contact.component';
import { UpdateContactConfirmComponent } from './update-contact-confirm/update-contact-confirm.component';
import { AddEntretienComponent } from './add-entretien/add-entretien.component';
import { PostAgenceByUserIdComponent } from './post-agence-by-user-id/post-agence-by-user-id.component';
import { GetPostByCategorieCommuneQuartierTypeComponent } from './get-post-by-categorie-commune-quartier-type/get-post-by-categorie-commune-quartier-type.component';
import { GetPostsForRentComponent } from './get-posts-for-rent/get-posts-for-rent.component';
import { GetPostsForSaleComponent } from './get-posts-for-sale/get-posts-for-sale.component';
import { GetAllCategoryComponent } from './get-all-category/get-all-category.component';
import { WhatPostComponent } from './what-post/what-post.component';
import { ResultRecherchByPostIdComponent } from './result-recherch-by-post-id/result-recherch-by-post-id.component';
import { OnContactFromResultCherchComponent } from './on-contact-from-result-cherch/on-contact-from-result-cherch.component';
import { UpdatePostComponent } from './update-post/update-post.component';
import { GetPostByCategoryComponent } from './get-post-by-category/get-post-by-category.component';
import { GetPostsByCategorieForRentComponent } from './get-posts-by-categorie-for-rent/get-posts-by-categorie-for-rent.component';
import { GetPostsByCategorieForSaleComponent } from './get-posts-by-categorie-for-sale/get-posts-by-categorie-for-sale.component';
import { GetPostCherchResultComponent } from './get-post-cherch-result/get-post-cherch-result.component';
import { GetPostsSaleCherchResultComponent } from './get-posts-sale-cherch-result/get-posts-sale-cherch-result.component';
import { AddPlanComponent } from './add-plan/add-plan.component';
import { AllPlanComponent } from './all-plan/all-plan.component';
import { AddDevisComponent } from './add-devis/add-devis.component';
import { GetDevisComponent } from './get-devis/get-devis.component';
import { UpdatePlanComponent } from './update-plan/update-plan.component';
import { AddPostSaleComponent } from './add-post-sale/add-post-sale.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AllPostRentSaleRandomComponent } from './all-post-rent-sale-random/all-post-rent-sale-random.component';
import { LandsComponent } from './lands/lands.component';
import { AllPostIngComponent } from './all-post-ing/all-post-ing.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddVideoComponent } from './add-video/add-video.component';
import { UpdatePostSaleComponent } from './update-post-sale/update-post-sale.component';
import { AddTerrainComponent } from './add-terrain/add-terrain.component';
import { UpdateTerrainComponent } from './update-terrain/update-terrain.component';
import { CherchRefComponent } from './cherch-ref/cherch-ref.component';
import { PostTrashComponent } from './post-trash/post-trash.component';
import { ConfirmRestorComponent } from './confirm-restor/confirm-restor.component';
import { AddVideoMobileComponent } from './add-video-mobile/add-video-mobile.component';
import { GetPostByVilleComponent } from './get-post-by-ville/get-post-by-ville.component';

@NgModule({
  declarations: [PostsComponent, AddPostComponent, ContactComponent, DetailPostComponent, DashboardComponent, MakingContactComponent, ContactConfirmListingComponent, OnConfirmContactComponent, UpdateContactConfirmComponent, AddEntretienComponent, PostAgenceByUserIdComponent, GetPostByCategorieCommuneQuartierTypeComponent, GetPostsForRentComponent, GetPostsForSaleComponent, GetAllCategoryComponent, WhatPostComponent, ResultRecherchByPostIdComponent, OnContactFromResultCherchComponent, UpdatePostComponent, GetPostByCategoryComponent, GetPostsByCategorieForRentComponent, GetPostsByCategorieForSaleComponent, GetPostCherchResultComponent, GetPostsSaleCherchResultComponent, AddPlanComponent, AllPlanComponent, AddDevisComponent, GetDevisComponent, UpdatePlanComponent, AddPostSaleComponent, AllPostRentSaleRandomComponent, LandsComponent, AllPostIngComponent, AddVideoComponent, UpdatePostSaleComponent, AddTerrainComponent, UpdateTerrainComponent, CherchRefComponent, PostTrashComponent, ConfirmRestorComponent, AddVideoMobileComponent, GetPostByVilleComponent],
  entryComponents: [
    ContactComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FontAwesomeModule,
    DemoMaterialModule,
    InfiniteScrollModule,
    NgxPaginationModule,
    ShimmerModule
  ]
})
export class PostsModule { }
