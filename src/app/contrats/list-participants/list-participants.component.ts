import { LoadingBarService } from '@ngx-loading-bar/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ListeVersementAgenceComponent } from './../liste-versement-agence/liste-versement-agence.component';
import { AddRaportComponent } from './../add-raport/add-raport.component';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContratService } from 'src/app/services/contrat.service';
import { UserService } from 'src/app/services/user.service';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';
import { AddRaportForChantierComponent } from '../add-raport-for-chantier/add-raport-for-chantier.component';
import { AddChantierComponent } from '../add-chantier/add-chantier.component';
import { Location } from '@angular/common';
import { AddParticipantComponent } from '../add-participant/add-participant.component';
import { UpdateParticipantComponent } from '../update-participant/update-participant.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-participants',
  templateUrl: './list-participants.component.html',
  styleUrls: ['./list-participants.component.css']
})
export class ListParticipantsComponent implements OnInit {
  participants: Contrat[] = [];
  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private contratService: ContratService, public userService: UserService, public print: PrintService, private dialog: MatDialog, private socket: Socket, private route: ActivatedRoute, private loadingBar: LoadingBarService, private location: Location) { }
  p: number = 1;
  contrat: any;


  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
    const contrat_id = this.route.snapshot.paramMap.get('contrat_id');
    this.contratService.getContratById(contrat_id).subscribe(resp => {
      this.contrat = resp;
      
    })
    this.getParticipants();
  }


  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getParticipants(){
    const contrat_id = this.route.snapshot.paramMap.get('contrat_id');
    this.loadingBar.start();
    this.contratService.getParticipants(contrat_id).subscribe(res => {
      this.participants = res;
      this.loadingBar.complete();
    })
  }

  /**
   * Ajoute ou crée l’élément demandé.
   */
  addParticipant(){
    this.dialog.open(AddParticipantComponent, {
      width: '600px',
      disableClose: false,
      data: {contrat: this.contrat},
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onUpdate ». 
   */
  onUpdate(contrat: any, participant: any){
    this.dialog.open(UpdateParticipantComponent, {
      width: '600px',
      disableClose: false,
      data: {contrat: contrat, participant: participant},
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onCancel ». 
   */
  onCancel(contrat: any, participant: any){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête enttrain de retiré cet participant!!!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, annulez-le !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contratService.deleteParticipant(contrat, participant).subscribe(resp => {
          Swal.fire("Retiré!!", "Participant retiré avec succès!!", "success");
        })
      }
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onBack ». 
   */
  onBack(){
    this.location.back()
  }

  /**
   * Libère les ressources utilisées par le composant avant sa destruction.
   */
  ngOnDestroy(){
    this.loadingBar.complete();
  }
}
