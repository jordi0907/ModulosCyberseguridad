import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrincipalComponent } from './principal/principal.component';
import { NuevoComponent } from './nuevo/nuevo.component';
import { ModificarComponent } from './modificar/modificar.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './guard/auth.guard';
import { RecuentoComponent } from './recuento/recuento.component';
import { PaillierComponent } from './paillier/paillier.component';
import { SecretsharingComponent } from './secretsharing/secretsharing.component';

const routes: Routes = [ { path: '', pathMatch: 'full', redirectTo: '/principal' },
{ path: 'auth', component: AuthComponent},
{ path: 'principal', component: PrincipalComponent},
{ path: 'recuento', component: RecuentoComponent},
{ path: 'nuevopersona', component: NuevoComponent},
{ path: 'paillier', component: PaillierComponent},
{ path: 'secretsharing', component: SecretsharingComponent},
{ path: ':id', component: ModificarComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
