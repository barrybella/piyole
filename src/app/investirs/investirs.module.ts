import { ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from './../services/material.service';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestirsRoutingModule } from './investirs-routing.module';
import { InvestirsComponent } from './investirs.component';
import { OpportunityInvestmentComponent } from './opportunity-investment/opportunity-investment.component';
import { DetailOpportunityComponent } from './detail-opportunity/detail-opportunity.component';
import { OnInvestComponent } from './on-invest/on-invest.component';


// Module de fonctionnalité "investirs" : regroupe les composants liés à
// l'investissement (liste des opportunités, détail d'une opportunité, formulaire
// pour investir).
@NgModule({
  declarations: [
    InvestirsComponent,
    OpportunityInvestmentComponent,
    DetailOpportunityComponent,
    OnInvestComponent,
  ],
  imports: [
    CommonModule,
    InvestirsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    DemoMaterialModule
  ]
})
export class InvestirsModule { }
