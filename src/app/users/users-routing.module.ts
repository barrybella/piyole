import { AllAgenciesComponent } from './all-agencies/all-agencies.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Table de routage du module "users" : inscription, connexion, profil et
// liste de toutes les agences. Note : les composants register-shop, register-chantier,
// login-shop et login-chantier existent mais ne sont pas routés directement ici —
// ils sont probablement ouverts en boîte de dialogue plutôt qu'en route dédiée.
const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'all-agencies', component: AllAgenciesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
