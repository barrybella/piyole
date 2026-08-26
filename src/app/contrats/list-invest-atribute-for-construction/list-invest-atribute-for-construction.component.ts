import { MatDialog } from '@angular/material/dialog';
import { AddRaportForInvestComponent } from './../add-raport-for-invest/add-raport-for-invest.component';
import { Contrat } from './../../interfaces/contrat';
import { ContratService } from 'src/app/services/contrat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-invest-atribute-for-construction',
  templateUrl: './list-invest-atribute-for-construction.component.html',
  styleUrls: ['./list-invest-atribute-for-construction.component.css']
})
export class ListInvestAtributeForConstructionComponent implements OnInit {
  contrats: Contrat[] = [];

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private contratService: ContratService, private dialog: MatDialog) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
    this.getContrats();
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getContrats(){
    this.contratService.getIngForConstructInvest().subscribe(res => {
      this.contrats = res;
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onAddRaport ». 
   */
  onAddRaport(contrat){
    this.dialog.open(AddRaportForInvestComponent, {
      width: '600px',
      data: {contrat: contrat}
    })
  }
}
