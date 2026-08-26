import { PostTrashComponent } from './post-trash/post-trash.component';
import { UpdateTerrainComponent } from './update-terrain/update-terrain.component';
import { AddTerrainComponent } from './add-terrain/add-terrain.component';
import { UpdatePostSaleComponent } from './update-post-sale/update-post-sale.component';
import { LandsComponent } from './lands/lands.component';
import { AllPostRentSaleRandomComponent } from './all-post-rent-sale-random/all-post-rent-sale-random.component';
import { AddPostSaleComponent } from './add-post-sale/add-post-sale.component';
import { UpdatePlanComponent } from './update-plan/update-plan.component';
import { AddPlanComponent } from './add-plan/add-plan.component';
import { GetPostsSaleCherchResultComponent } from './get-posts-sale-cherch-result/get-posts-sale-cherch-result.component';
import { GetPostsByCategorieForRentComponent } from './get-posts-by-categorie-for-rent/get-posts-by-categorie-for-rent.component';
import { GetAllCategoryComponent } from './get-all-category/get-all-category.component';
import { GetPostsForRentComponent } from './get-posts-for-rent/get-posts-for-rent.component';
import { GetPostByCategorieCommuneQuartierTypeComponent } from './get-post-by-categorie-commune-quartier-type/get-post-by-categorie-commune-quartier-type.component';
import { PostAgenceByUserIdComponent } from './post-agence-by-user-id/post-agence-by-user-id.component';
import { ContactConfirmListingComponent } from './contact-confirm-listing/contact-confirm-listing.component';
import { MakingContactComponent } from './making-contact/making-contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddPostComponent } from './add-post/add-post.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { GetPostsForSaleComponent } from './get-posts-for-sale/get-posts-for-sale.component';
import { ResultRecherchByPostIdComponent } from './result-recherch-by-post-id/result-recherch-by-post-id.component';
import { UpdatePostComponent } from './update-post/update-post.component';
import { GetPostByCategoryComponent } from './get-post-by-category/get-post-by-category.component';
import { GetPostsByCategorieForSaleComponent } from './get-posts-by-categorie-for-sale/get-posts-by-categorie-for-sale.component';
import { GetPostCherchResultComponent } from './get-post-cherch-result/get-post-cherch-result.component';
import { AllPlanComponent } from './all-plan/all-plan.component';
import { GetDevisComponent } from './get-devis/get-devis.component';
import { AllPostIngComponent } from './all-post-ing/all-post-ing.component';
import { GetPostByVilleComponent } from './get-post-by-ville/get-post-by-ville.component';

const routes: Routes = [
  { path: 'add-post', component: AddPostComponent },
  { path: 'add-post-sale', component: AddPostSaleComponent },
  { path: 'add-terrain', component: AddTerrainComponent },
  { path: 'all-post-rent-sale-random', component: AllPostRentSaleRandomComponent },
  { path: 'vente-achat-location-terrain-maison-partout-en-guinee-conakry', component: AllPostRentSaleRandomComponent, data: { title: 'Achetez ou Louez un Appartement, Bureau, Terrain, Duplex, Villa, Maison, Studio ou Immeuble partout en Guinée Conakry' } },
  { path: 'all-post-ing', component: AllPostIngComponent },
  { path: 'get-post-by-ville/:region', component: GetPostByVilleComponent },
  { path: 'add-plan', component: AddPlanComponent },
  { path: 'post-trash', component: PostTrashComponent },
  { path: 'detail-post/:id', component: DetailPostComponent},
  { path: 'update-post/:id', component: UpdatePostComponent},
  { path: 'update-plan/:id', component: UpdatePlanComponent},
  { path: 'update-post-sale/:id', component: UpdatePostSaleComponent},
  { path: 'update-terrain/:id', component: UpdateTerrainComponent},
  { path: 'get-post-by-category/:categorie', component: GetPostByCategoryComponent},
  { path: 'get-posts-by-categorie-for-rent/:categorie', component: GetPostsByCategorieForRentComponent},
  { path: 'get-posts-by-categorie-for-sale/:categorie', component: GetPostsByCategorieForSaleComponent},
  { path: 'get-posts-rent-cherch-result/:commune/:quartier/:type/:categorie/:min/:max', component: GetPostCherchResultComponent },
  { path: 'get-posts-sale-cherch-result/:commune/:quartier/:type/:categorie/:min/:max', component: GetPostsSaleCherchResultComponent },
  { path: 'get-posts-for-rent', component: GetPostsForRentComponent},
  { path: 'location-maisons-terrain-villa-appartement-partout-en-guinee-conakry', component: GetPostsForRentComponent,  data: { title: 'Louez un Appartement, Bureau, Terrain, Duplex, Villa, Maison, Studio ou Immeuble partout en Guinée Conakry' } },
  { path: 'vente-maisons-terrain-villa-appartement-partout-en-guinee-conakry', component: GetPostsForSaleComponent, data: { title: 'Achetez un Terrain, Duplex, Villa, Maison, Bureau, Appartement, Studio ou Immeuble partout en Guinée Conakry' }},
  { path: 'get-posts-for-sale', component: GetPostsForSaleComponent},
  { path: 'all-plans', component: AllPlanComponent},
  { path: 'vente-plan-de-construction-guinee-conakry', component: AllPlanComponent, data: { title: 'Achetez un Plan de Construction partout en Guinée Conakry'}},
  { path: 'lands', component: LandsComponent},
  { path: 'vente-de-terrain-partout-en-guinee-conakry', component: LandsComponent, data: { title: 'Achetez un Terrain partout en Guinée Conakry'}},
  { path: 'get-devis/:id', component: GetDevisComponent},
  { path: 'get-post-by-categorie-commune-quartier-type/:categorie/:commune/:quartier/:type', component: GetPostByCategorieCommuneQuartierTypeComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'making-contact', component: MakingContactComponent},
  { path: 'contact-confirm-listing', component: ContactConfirmListingComponent},
  { path: 'get-all-category', component: GetAllCategoryComponent, data: { title: 'Catégories des Biens Immobiliers et Matériaux de Construction'}},
  { path: 'result-recherch-by-post-id/:id', component: ResultRecherchByPostIdComponent },
  { path: ':id', component: PostAgenceByUserIdComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
