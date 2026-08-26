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

// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

// for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

// import {AngularFireModule} from "@angular/fire/compat";
// import {AngularFireStorageModule} from "@angular/fire/compat/storage";
// import { environment } from 'src/environments/environment';

// import { AngularFireModule } from '@angular/fire';

// import { initializeApp } from '@angular/fire/app';
// import { AngularFireStorageModule } from '@angular/fire/storage';
// import { initializeApp } from '@angular/fire/app';
// import { AngularFireStorageModule } from '@angular/fire/storage';

// import { AngularFireModule } from '@angular/fire';
// import { AngularFireStorageModule } from '@angular/fire/storage';

// import { initializeApp } from '@angular/fire/app';
// import { AngularFireModule } from '@angular/fire/compat';

// const firebaseConfig = {
//   apiKey: "AIzaSyBwSypd4-vSf_5NCF8S7Qc6wC0t7Kk2t6M",
//   authDomain: "api-p-20257.firebaseapp.com",
//   projectId: "api-p-20257",
//   storageBucket: "api-p-20257.appspot.com",
//   messagingSenderId: "575586778110",
//   appId: "1:575586778110:web:5f1e8d21fd82e512fb5eaf"
// }

// initializeApp(firebaseConfig);

// import { AngularFireModule } from '@angular/fire';
// import { AngularFireStorageModule } from '@angular/fire/storage';

import { AngularFireModule } from '@angular/fire/compat'; // Importez depuis '@angular/fire/compat'
import { AngularFireStorageModule } from '@angular/fire/compat/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyBwSypd4-vSf_5NCF8S7Qc6wC0t7Kk2t6M",
  authDomain: "api-p-20257.firebaseapp.com",
  projectId: "api-p-20257",
  storageBucket: "api-p-20257.appspot.com",
  messagingSenderId: "575586778110",
  appId: "1:575586778110:web:5f1e8d21fd82e512fb5eaf"
};

const config: SocketIoConfig = { url: `${baseUrl}`, options: { }};

@NgModule({
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
  providers: [
    {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
