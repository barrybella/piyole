import { Component, OnInit } from '@angular/core';

// Composant déclaré mais actuellement vide (structure de base uniquement) —
// probablement destiné à confirmer la suppression d'un article du panier.
@Component({
  selector: 'app-delete-basket',
  templateUrl: './delete-basket.component.html',
  styleUrls: ['./delete-basket.component.css']
})
export class DeleteBasketComponent implements OnInit {

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor() { }

  ngOnInit(): void {
  }

}
