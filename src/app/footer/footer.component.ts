import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Composant de pied de page, affiché sur toutes les pages. Fournit une navigation
// simple vers d'autres routes de l'application.
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // Navigue vers la route donnée.
  onRedirect(route: any){
    this.router.navigate([route])
  }
}
