import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
import { Socket } from 'ngx-socket-io';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { StopContratComponent } from './../stop-contrat/stop-contrat.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Contrat } from './../../interfaces/contrat';
import { ContratService } from 'src/app/services/contrat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-pres-avis-donner',
  templateUrl: './pres-avis-donner.component.html',
  styleUrls: ['./pres-avis-donner.component.css']
})
export class PresAvisDonnerComponent implements OnInit, OnDestroy {
  contrats?: Contrat[] = [];

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private contratService: ContratService, private dialog: MatDialog, private socket: Socket, public print: PrintService, private router: Router, private loadingBar: LoadingBarService) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
    this.getPresAvisDonner();
    this.socket.on('contrat_emit', () => {
      this.getPresAvisDonner(); 
     });
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getPresAvisDonner(){
    this.loadingBar.start();
    this.contratService.getPresAvisDonner().subscribe(res => {
      this.contrats = res;
      this.loadingBar.complete();
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onRedirect ». 
   */
  onRedirect(route: any, id: any){
    this.router.navigate([route, id]);
  }

  /**
   * Exécute le traitement associé à la méthode « onDetail ». 
   */
  onDetail(id: any){
    this.router.navigate(['posts/result-recherch-by-post-id', id]);
  }

  /**
   * Exécute le traitement associé à la méthode « onDetailContrat ». 
   */
  onDetailContrat(contrat: any){
    this.router.navigate(['contrats/detail-contrat', contrat._id]);
  }

  /**
   * Exécute le traitement associé à la méthode « stopContrat ». 
   */
  stopContrat(contrat: any){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête entrain d'annuler cette attretient!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, declinez-le !',
      cancelButtonText: 'Annuler'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.dialog.open(StopContratComponent, {
          width: '550px',
          data: {contrat: contrat},
          disableClose: true
        })
      }
    });
  }

  /**
   * Exécute le traitement associé à la méthode « whatPost ». 
   */
  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }

  /**
   * Exécute le traitement associé à la méthode « redirectRoutes ». 
   */
  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  /**
   * Libère les ressources utilisées par le composant avant sa destruction.
   */
  ngOnDestroy(){
    this.loadingBar.complete();
  }
}
