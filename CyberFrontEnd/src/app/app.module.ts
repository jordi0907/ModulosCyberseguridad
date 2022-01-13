import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrincipalComponent } from './principal/principal.component';
import { NuevoComponent } from './nuevo/nuevo.component';
import { ModificarComponent } from './modificar/modificar.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptor } from './shared/authconfig.interceptor';
import { RecuentoComponent } from './recuento/recuento.component';
import { PaillierComponent } from './paillier/paillier.component';
import { SecretsharingComponent } from './secretsharing/secretsharing.component';


@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    NuevoComponent,
    ModificarComponent,
    AuthComponent,
    RecuentoComponent,
    PaillierComponent,
    SecretsharingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
   /*  {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    } */
],
  bootstrap: [AppComponent]
})
export class AppModule { }
