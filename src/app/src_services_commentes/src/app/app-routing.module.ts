import { ContactUsComponent } from './contact-us/contact-us.component';
import { PostAgenceByUserIdComponent } from './posts/post-agence-by-user-id/post-agence-by-user-id.component';
import { AuthGuard } from './guard/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


const routes: Routes = [
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'posts', loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule) },
  { path: 'contact-us', component: ContactUsComponent, data: { title: 'Contactez Piyole'} },
  { path: 'home', component: HomeComponent,  data: { title: 'Bienvenue sur Piyole' } },
  { path: 'reset-password/:id', component: ResetPasswordComponent },
  { path: '', redirectTo: '/home',pathMatch: 'full', data: { title: 'Bienvenue sur Piyole' }},
  { path: 'contrats', loadChildren: () => import('./contrats/contrats.module').then(m => m.ContratsModule) },
  { path: 'tools', loadChildren: () => import('./tools/tools.module').then(m => m.ToolsModule) },
  { path: 'investirs', loadChildren: () => import('./investirs/investirs.module').then(m => m.InvestirsModule) },
  { path: ':slug', component: PostAgenceByUserIdComponent},
  { path: 'shops', loadChildren: () => import('./shops/shops.module').then(m => m.ShopsModule) },
  { path: 'commandes', loadChildren: () => import('./commandes/commandes.module').then(m => m.CommandesModule) },
  { path: '**', component: NotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
