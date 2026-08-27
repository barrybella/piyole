import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { baseUrl } from './backend';
import { DemoMaterialModule } from './services/material.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { GlobalErrorHandlerService } from './services/global-error.service';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { VoirPlusComponent } from './voir-plus/voir-plus.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';








// Module racine de l'application Angular. Déclare les composants globaux (header,
// footer, page d'accueil, gestion de mot de passe, etc.), importe les modules Angular
// et tiers nécessaires (Material, pagination, WebSocket/Socket.IO, Firebase Storage,
// barre de chargement), et configure les fournisseurs globaux (gestion d'erreurs,
// intercepteur d'authentification HTTP).

// Configuration Firebase pour le stockage (AngularFireStorage).
// Note : contrairement à une clé AWS, la "apiKey" Firebase est conçue pour être publique
// (voir la documentation officielle Firebase) — la sécurité réelle repose sur les règles
// de sécurité configurées côté Firebase (Storage/Firestore Rules), pas sur le secret de cette clé.
const firebaseConfig = {
 
};

// Configuration de la connexion WebSocket (Socket.IO) vers le backend, pour les
// fonctionnalités temps réel de l'application.
const config: SocketIoConfig = { url: `${baseUrl}`, options: { }};

@NgModule({
  // Composants "globaux" déclarés directement dans le module racine (les autres
  // composants sont déclarés dans leurs modules de fonctionnalité respectifs :
  // contrats, posts, shops, etc.).
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    NotFoundComponent,
    VoirPlusComponent,
    FooterComponent,
    ConfirmPasswordComponent,
    ContactUsComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    UpdatePasswordComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    NoopAnimationsModule,
    DemoMaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    SocketIoModule.forRoot(config),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule
  ],
  // Fournisseurs globaux : gestion centralisée des erreurs (voir global-error.service.ts)
  // et intercepteur HTTP qui attache automatiquement le token d'authentification
  // à chaque requête sortante (voir interceptors/auth.interceptor.ts).
  providers: [
    {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
