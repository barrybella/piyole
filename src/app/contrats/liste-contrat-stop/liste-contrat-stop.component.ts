import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { MatDialog } from '@angular/material/dialog';
import { VoirPlusComponent } from 'src/app/voir-plus/voir-plus.component';
import { PrintService } from 'src/app/services/print.service';
import { ContratService } from 'src/app/services/contrat.service';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-liste-contrat-stop',
  templateUrl: './liste-contrat-stop.component.html',
  styleUrls: ['./liste-contrat-stop.component.css']
})
export class ListeContratStopComponent implements OnInit, OnDestroy {
  contrats?: Contrat[] = [];

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private contratService: ContratService, public print: PrintService, private dialog: MatDialog, private router: Router, private loadingBar: LoadingBarService) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
    this.getContratStoper();
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getContratStoper(){
    this.loadingBar.start();
    this.contratService.getContratStoper().subscribe(res => {
      this.contrats = res;
      this.loadingBar.complete();
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onVoirPlus ». 
   */
  onVoirPlus(text: any){
    this.dialog.open(VoirPlusComponent, {
      data: {text: text},
      width: '500px'
    })
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
   * Libère les ressources utilisées par le composant avant sa destruction.
   */
  ngOnDestroy(){
    this.loadingBar.complete();
  }  
}
