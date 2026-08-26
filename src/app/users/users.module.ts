import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { AllAgenciesComponent } from './all-agencies/all-agencies.component';
import { LoginShopComponent } from './login-shop/login-shop.component';
import { RegisterShopComponent } from './register-shop/register-shop.component';
import { LoginChantierComponent } from './login-chantier/login-chantier.component';
import { RegisterChantierComponent } from './register-chantier/register-chantier.component';


// Module de fonctionnalité "users" : regroupe l'inscription/connexion "standard"
// (client) ainsi que les variantes spécifiques pour les agences (shop) et les
// ingénieurs de suivi de chantier (chantier), en plus du profil et de la liste
// des agences.
@NgModule({
  declarations: [UsersComponent, RegisterComponent, LoginComponent, ProfileComponent, AllAgenciesComponent, LoginShopComponent, RegisterShopComponent, LoginChantierComponent, RegisterChantierComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    SharedModule,
    ShimmerModule
  ]
})
export class UsersModule { }
