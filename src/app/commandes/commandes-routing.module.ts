import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandesComponent } from './commandes.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ListeCommandePanelComponent } from './liste-commande-panel/liste-commande-panel.component';

// Table de routage du module "commandes" : liste des commandes côté vendeur/agence
// (order-list) et côté client (liste-commande-panel).
const routes: Routes = [
  { path: 'order-list', component: OrderListComponent },
  { path: 'liste-commande-panel', component: ListeCommandePanelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommandesRoutingModule { }
