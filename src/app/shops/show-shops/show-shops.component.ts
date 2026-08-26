import { Component, Input, OnInit } from '@angular/core';

// Composant réutilisable destiné à afficher une liste de boutiques (structure de
// base, sans logique propre — reçoit probablement les boutiques via une propriété
// d'entrée non encore déclarée).
@Component({
  selector: 'app-show-shops',
  templateUrl: './show-shops.component.html',
  styleUrls: ['./show-shops.component.css']
})
export class ShowShopsComponent implements OnInit {
 

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor() { }

  ngOnInit(): void {
  }

}
