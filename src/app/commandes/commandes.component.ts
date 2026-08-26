import { Component, OnInit } from '@angular/core';

// Composant conteneur du module "commandes".
@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor() { }

  ngOnInit(): void {
  }

}
