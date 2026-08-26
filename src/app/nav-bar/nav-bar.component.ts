import { Component, Input, OnInit } from '@angular/core';

// Composant réutilisable affichant un titre et un sous-titre (barre de navigation
// contextuelle), personnalisable via des propriétés d'entrée depuis le composant parent.
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input() title?: string;
  @Input() subTitle?: string;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor() { }

  ngOnInit() {
  }

}
