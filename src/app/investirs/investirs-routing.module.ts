import { DetailOpportunityComponent } from './detail-opportunity/detail-opportunity.component';
import { OpportunityInvestmentComponent } from './opportunity-investment/opportunity-investment.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestirsComponent } from './investirs.component';

// Table de routage du module "investirs" : liste des opportunités d'investissement
// et détail d'une opportunité précise (via son identifiant).
const routes: Routes = [
  { path: 'opportunity-investment', component: OpportunityInvestmentComponent },
  { path: 'detail-opportunity/:id', component: DetailOpportunityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestirsRoutingModule { }
