import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { PrintService } from './../../services/print.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './../../services/user.service';
import { ContratService } from './../../services/contrat.service';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-contrat-invest',
  templateUrl: './list-contrat-invest.component.html',
  styleUrls: ['./list-contrat-invest.component.css']
})
export class ListContratInvestComponent implements OnInit {
  contrats: Contrat[] = [];
  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private contratService: ContratService, private userService: UserService, private dialog: MatDialog, public print: PrintService) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
    this.getContratsForInvests();
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getContratsForInvests(){
    this.contratService.getContratsForInvestsByInvestisseur().subscribe(res => {
      this.contrats = res;

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
}
