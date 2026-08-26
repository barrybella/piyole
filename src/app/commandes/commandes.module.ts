import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommandesRoutingModule } from './commandes-routing.module';
import { CommandesComponent } from './commandes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';
import { AddCommandeComponent } from './add-commande/add-commande.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ProductListeCommandeComponent } from './product-liste-commande/product-liste-commande.component';
import { ListeCommandePanelComponent } from './liste-commande-panel/liste-commande-panel.component';
import { EtatLivraisonComponent } from './etat-livraison/etat-livraison.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { OnPayComponent } from './on-pay/on-pay.component';

// Module de fonctionnalité "commandes" : regroupe les composants liés à la gestion
// des commandes de produits (création, listes côté vendeur et client, état de
// livraison, confirmation de paiement).
@NgModule({
  declarations: [
    CommandesComponent,
    AddCommandeComponent,
    OrderListComponent,
    ProductListeCommandeComponent,
    ListeCommandePanelComponent,
    EtatLivraisonComponent,
    OnPayComponent
  ],
  imports: [
    CommonModule,
    CommandesRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    MatSlideToggleModule
  ]
})
export class CommandesModule { }
