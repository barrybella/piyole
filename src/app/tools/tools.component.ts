import { Component, OnInit } from '@angular/core';

// Composant conteneur du module "tools" — sert probablement de point d'entrée
// affichant un ou plusieurs sous-composants (ex. add-besoin) via son template.
@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor() { }

  ngOnInit(): void {
  }

}
