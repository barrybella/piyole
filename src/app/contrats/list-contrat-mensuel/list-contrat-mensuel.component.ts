import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { StopContratComponent } from './../stop-contrat/stop-contrat.component';
import { AddResiliationComponent } from './../add-resiliation/add-resiliation.component';
import   Swal from 'sweetalert2';
import { AddPresAvisComponent } from './../add-pres-avis/add-pres-avis.component';
import { Socket } from 'ngx-socket-io';
import { UpdatePrixComponent } from './../update-prix/update-prix.component';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContratService } from 'src/app/services/contrat.service';
import { UserService } from 'src/app/services/user.service';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-contrat-mensuel',
  templateUrl: './list-contrat-mensuel.component.html',
  styleUrls: ['./list-contrat-mensuel.component.css']
})
export class ListContratMensuelComponent implements OnInit, OnDestroy {
  contrats: Contrat[] = [];
  p: number = 1;
  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private contratService: ContratService, private userService: UserService, public print: PrintService, private dialog: MatDialog, private socket: Socket, private router: Router, private loadingBar: LoadingBarService) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
    this.getContrats();
    this.socket.on('contrat_emit', () => {
      this.getContrats(); 
     });
    
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getContrats(){
    this.loadingBar.start();
    this.contratService.getContratMensuels().subscribe(res => {
      this.contrats = res;
      this.loadingBar.complete();
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onDetail ». 
   */
  onDetail(id: any){
    this.router.navigate(['posts/result-recherch-by-post-id', id]);
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
   * Exécute le traitement associé à la méthode « onRedirect ». 
   */
  onRedirect(route: any, id: any){
    this.router.navigate([route, id]);
  }

  /**
   * Exécute le traitement associé à la méthode « onUpdatePrix ». 
   */
  onUpdatePrix(contrat: any){
    this.dialog.open(UpdatePrixComponent, {
      width: '500px',
      data:{contrat: contrat}
    })
  }

  /**
   * Ajoute ou crée l’élément demandé.
   */
  addPresAvis(contrat: any){
    this.dialog.open(AddPresAvisComponent, {
      width: '550px',
      data: {contrat: contrat},
    })
  }

  /**
   * Ajoute ou crée l’élément demandé.
   */
  addResiliation(contrat: any){
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
        this.dialog.open(AddResiliationComponent, {
          width: '550px',
          data: {contrat: contrat},
        })
      }
    });
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getTypeContrat(type){
    if(type == 0){
      return 'Mensuel';
    }else if(type == 1){
      return 'Journalier';
    }else if(type == 2){
      return 'Pas de suivie';
    }
  }


  /**
   * Exécute le traitement associé à la méthode « redirectRoutes ». 
   */
  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  /**
   * Exécute le traitement associé à la méthode « monthDiff ». 
   */
  monthDiff(d1: any, d2: any) { var months; months = (d2.getFullYear() - d1.getFullYear()) * 12; months -= d1.getMonth(); months += d2.getMonth(); return months <= 0 ? 0 : months; }

  /**
   * Libère les ressources utilisées par le composant avant sa destruction.
   */
  ngOnDestroy(){
    this.loadingBar.complete();
  }
}
