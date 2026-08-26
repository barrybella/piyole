import { ListContratVenteClientComponent } from './list-contrat-vente-client/list-contrat-vente-client.component';
import { ListContratJournalierClientComponent } from './list-contrat-journalier-client/list-contrat-journalier-client.component';
import { ListContratMensuelClientComponent } from './list-contrat-mensuel-client/list-contrat-mensuel-client.component';
import { ListContratVenteComponent } from './list-contrat-vente/list-contrat-vente.component';
import { ListContratJournalierComponent } from './list-contrat-journalier/list-contrat-journalier.component';
import { DetailContratComponent } from './detail-contrat/detail-contrat.component';
import { ListContratMensuelComponent } from './list-contrat-mensuel/list-contrat-mensuel.component';
import { ListeResilierComponent } from './liste-resilier/liste-resilier.component';
import { ListeContratStopComponent } from './liste-contrat-stop/liste-contrat-stop.component';
import { PresAvisDonnerComponent } from './pres-avis-donner/pres-avis-donner.component';
import { PresAvisDemandeComponent } from './pres-avis-demande/pres-avis-demande.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './../guard/auth.guard';
import { ListeContratForClientComponent } from './liste-contrat-for-client/liste-contrat-for-client.component';
import { ListeContratPlanClientComponent } from './liste-contrat-plan-client/liste-contrat-plan-client.component';
import { PayementsContratClientComponent } from './payements-contrat-client/payements-contrat-client.component';
import { RaportConstructionForInvestComponent } from './raport-construction-for-invest/raport-construction-for-invest.component';
import { ListInvestAtributeForConstructionComponent } from './list-invest-atribute-for-construction/list-invest-atribute-for-construction.component';
import { ListContratInvestComponent } from './list-contrat-invest/list-contrat-invest.component';
import { RaportConstructionComponent } from './raport-construction/raport-construction.component';
import { ListContratConstructionForClientComponent } from './list-contrat-construction-for-client/list-contrat-construction-for-client.component';
import { ListContratConstructionComponent } from './list-contrat-construction/list-contrat-construction.component';
import { ListContratPlanComponent } from './list-contrat-plan/list-contrat-plan.component';
import { PayementsContratComponent } from './payements-contrat/payements-contrat.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratsComponent } from './contrats.component';
import { ListContratComponent } from './list-contrat/list-contrat.component';
import { ContratSuivieChantierComponent } from './contrat-suivie-chantier/contrat-suivie-chantier.component';
import { RaportConstructionForChantierComponent } from './raport-construction-for-chantier/raport-construction-for-chantier.component';
import { ListParticipantsComponent } from './list-participants/list-participants.component';
import { ChantiersComponent } from './chantiers/chantiers.component';

const routes: Routes = [
  { path: 'chantiers', component: ChantiersComponent, data: { title: 'Suivez votre Chantier et Approvisionnez-vous en Matériaux de Construction'} },
  { path: 'raport-construction-for-chantier/:contrat_id', component: RaportConstructionForChantierComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'list-contrat', component: ListContratComponent, canActivate: [AuthGuard] },
  { path: 'list-contrat-mensuel', component: ListContratMensuelComponent, canActivate: [AuthGuard] },
  { path: 'list-contrat-mensuel-client', component: ListContratMensuelClientComponent, canActivate: [AuthGuard] },
  { path: 'list-contrat-vente-client', component: ListContratVenteClientComponent, canActivate: [AuthGuard] },
  { path: 'list-contrat-journalier-client', component: ListContratJournalierClientComponent, canActivate: [AuthGuard] },
  { path: 'list-contrat-vente', component: ListContratVenteComponent, canActivate: [AuthGuard] },
  { path: 'list-contrat-journalier', component: ListContratJournalierComponent, canActivate: [AuthGuard] },
  { path: 'pres-avis-demande', component: PresAvisDemandeComponent, canActivate: [AuthGuard] },
  { path: 'pres-avis-donner', component: PresAvisDonnerComponent, canActivate: [AuthGuard] },
  { path: 'liste-contrat-stop', component: ListeContratStopComponent, canActivate: [AuthGuard] },
  { path: 'liste-resilier', component: ListeResilierComponent, canActivate: [AuthGuard] },
  { path: 'list-contrat-plan', component: ListContratPlanComponent, canActivate: [AuthGuard] },
  { path: 'list-contrat-construction', component: ListContratConstructionComponent, canActivate: [AuthGuard] },
  { path: 'contrat-suivie-chantier', component: ContratSuivieChantierComponent, canActivate: [AuthGuard] },
  { path: 'list-contrat-invest', component: ListContratInvestComponent, canActivate: [AuthGuard] },
  { path: 'list-invest-atribute-for-construction', component: ListInvestAtributeForConstructionComponent, canActivate: [AuthGuard] },
  { path: 'list-contrat-construction-for-client', component: ListContratConstructionForClientComponent, canActivate: [AuthGuard] },
  { path: 'liste-contrat-for-client', component: ListeContratForClientComponent, canActivate: [AuthGuard] },
  { path: 'liste-contrat-plan-client', component: ListeContratPlanClientComponent, canActivate: [AuthGuard] },
  { path: 'raport-construction/:contrat_id', component: RaportConstructionComponent, canActivate: [AuthGuard] },
  { path: 'list-participants/:contrat_id', component: ListParticipantsComponent, canActivate: [AuthGuard] },
  { path: 'raport-construction-for-invest/:contrat_id', component: RaportConstructionForInvestComponent, canActivate: [AuthGuard] },
  { path: 'payements-contrat/:id', component: PayementsContratComponent, canActivate: [AuthGuard] },
  { path: 'payements-contrat-client/:id', component: PayementsContratClientComponent, canActivate: [AuthGuard] },
  { path: 'detail-contrat/:id', component: DetailContratComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratsRoutingModule { }
