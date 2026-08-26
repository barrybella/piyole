import { Component, OnInit } from '@angular/core';

// Page 404, affichée lorsqu'aucune route ne correspond à l'URL demandée
// (voir la route "**" dans app-routing.module.ts).
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor() { }

  ngOnInit() {
  }

}
