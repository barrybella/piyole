import { NgxPaginationModule } from 'ngx-pagination';
import { DemoMaterialModule } from './../services/material.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContratsRoutingModule } from './contrats-routing.module';
import { ContratsComponent } from './contrats.component';
import { ListContratComponent } from './list-contrat/list-contrat.component';
import { SharedModule } from '../shared/shared.module';
import { PayementsContratComponent } from './payements-contrat/payements-contrat.component';
import { AddPayementComponent } from './add-payement/add-payement.component';
import { AddContratForSaleComponent } from './add-contrat-for-sale/add-contrat-for-sale.component';
import { RenouvellementContratJournalierComponent } from './renouvellement-contrat-journalier/renouvellement-contrat-journalier.component';
import { ListContratPlanComponent } from './list-contrat-plan/list-contrat-plan.component';
import { ListContratConstructionComponent } from './list-contrat-construction/list-contrat-construction.component';
import { ListContratConstructionForClientComponent } from './list-contrat-construction-for-client/list-contrat-construction-for-client.component';
import { RaportConstructionComponent } from './raport-construction/raport-construction.component';
import { AddRaportComponent } from './add-raport/add-raport.component';
import { UpdateRaportComponent } from './update-raport/update-raport.component';
import { ListContratInvestComponent } from './list-contrat-invest/list-contrat-invest.component';
import { ListInvestAtributeForConstructionComponent } from './list-invest-atribute-for-construction/list-invest-atribute-for-construction.component';
import { AddRaportForInvestComponent } from './add-raport-for-invest/add-raport-for-invest.component';
import { RaportConstructionForInvestComponent } from './raport-construction-for-invest/raport-construction-for-invest.component';
import { DeleteRaportComponent } from './delete-raport/delete-raport.component';
import { ListeVersementAgenceComponent } from './liste-versement-agence/liste-versement-agence.component';
import { PayementsContratClientComponent } from './payements-contrat-client/payements-contrat-client.component';
import { ListeContratPlanClientComponent } from './liste-contrat-plan-client/liste-contrat-plan-client.component';
import { ListeContratForClientComponent } from './liste-contrat-for-client/liste-contrat-for-client.component';
import { ListePayementClientComponent } from './liste-payement-client/liste-payement-client.component';
import { UpdatePrixComponent } from './update-prix/update-prix.component';
import { RemovePayementComponent } from './remove-payement/remove-payement.component';
import { RemovePayementJournalierComponent } from './remove-payement-journalier/remove-payement-journalier.component';
import { AddPresAvisComponent } from './add-pres-avis/add-pres-avis.component';
import { SettingsComponent } from './settings/settings.component';
import { PresAvisDemandeComponent } from './pres-avis-demande/pres-avis-demande.component';
import { StopContratComponent } from './stop-contrat/stop-contrat.component';
import { PresAvisDonnerComponent } from './pres-avis-donner/pres-avis-donner.component';
import { ListeContratStopComponent } from './liste-contrat-stop/liste-contrat-stop.component';
import { AddResiliationComponent } from './add-resiliation/add-resiliation.component';
import { ListeResilierComponent } from './liste-resilier/liste-resilier.component';
import { AddRaportVideoComponent } from './add-raport-video/add-raport-video.component';
import { ListContratMensuelComponent } from './list-contrat-mensuel/list-contrat-mensuel.component';
import { DetailContratComponent } from './detail-contrat/detail-contrat.component';
import { ListContratJournalierComponent } from './list-contrat-journalier/list-contrat-journalier.component';
import { ListContratVenteComponent } from './list-contrat-vente/list-contrat-vente.component';
import { ListContratMensuelClientComponent } from './list-contrat-mensuel-client/list-contrat-mensuel-client.component';
import { ListContratJournalierClientComponent } from './list-contrat-journalier-client/list-contrat-journalier-client.component';
import { ListContratVenteClientComponent } from './list-contrat-vente-client/list-contrat-vente-client.component';
import { AddRaportVideoMobileComponent } from './add-raport-video-mobile/add-raport-video-mobile.component';
import { ContratSuivieChantierComponent } from './contrat-suivie-chantier/contrat-suivie-chantier.component';
import { AddRaportForChantierComponent } from './add-raport-for-chantier/add-raport-for-chantier.component';
import { RaportConstructionForChantierComponent } from './raport-construction-for-chantier/raport-construction-for-chantier.component';
import { AddRaportVideoForChantierComponent } from './add-raport-video-for-chantier/add-raport-video-for-chantier.component';
import { AddChantierComponent } from './add-chantier/add-chantier.component';
import { ListParticipantsComponent } from './list-participants/list-participants.component';
import { AddParticipantComponent } from './add-participant/add-participant.component';
import { UpdateParticipantComponent } from './update-participant/update-participant.component';
import { UpdateRaportChantierComponent } from './update-raport-chantier/update-raport-chantier.component';
import { ChantiersComponent } from './chantiers/chantiers.component';
import { ViewImagesComponent } from './view-images/view-images.component';

@NgModule({
  declarations: [
    ContratsComponent,
    ListContratComponent,
    PayementsContratComponent,
    AddPayementComponent,
    AddContratForSaleComponent,
    RenouvellementContratJournalierComponent,
    ListContratPlanComponent,
    ListContratConstructionComponent,
    ListContratConstructionForClientComponent,
    RaportConstructionComponent,
    AddRaportComponent,
    UpdateRaportComponent,
    ListContratInvestComponent,
    ListInvestAtributeForConstructionComponent,
    AddRaportForInvestComponent,
    RaportConstructionForInvestComponent,
    DeleteRaportComponent,
    ListeVersementAgenceComponent,
    PayementsContratClientComponent,
    ListeContratPlanClientComponent,
    ListeContratForClientComponent,
    ListePayementClientComponent,
    UpdatePrixComponent,
    RemovePayementComponent,
    RemovePayementJournalierComponent,
    AddPresAvisComponent,
    SettingsComponent,
    PresAvisDemandeComponent,
    StopContratComponent,
    PresAvisDonnerComponent,
    ListeContratStopComponent,
    AddResiliationComponent,
    ListeResilierComponent,
    AddRaportVideoComponent,
    ListContratMensuelComponent,
    DetailContratComponent,
    ListContratJournalierComponent,
    ListContratVenteComponent,
    ListContratMensuelClientComponent,
    ListContratJournalierClientComponent,
    ListContratVenteClientComponent,
    AddRaportVideoMobileComponent,
    ContratSuivieChantierComponent,
    AddRaportForChantierComponent,
    RaportConstructionForChantierComponent,
    AddRaportVideoForChantierComponent,
    AddChantierComponent,
    ListParticipantsComponent,
    AddParticipantComponent,
    UpdateParticipantComponent,
    UpdateRaportChantierComponent,
    ChantiersComponent,
    ViewImagesComponent
  ],
  imports: [
    CommonModule,
    ContratsRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
  ]
})
export class ContratsModule { }
