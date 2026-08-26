import { JsService } from './services/js.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

// Composant racine de l'application (point d'entrée visuel). Gère le chargement
// des scripts globaux et met à jour dynamiquement le titre de l'onglet du navigateur
// en fonction de la route active.
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'maison-public';

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private js: JsService, private titleService: Title, private router: Router, private activatedRoute: ActivatedRoute){}
  
  // Au démarrage de l'application : charge les scripts jQuery/plugins globaux, puis
  // s'abonne aux événements de navigation pour mettre à jour le titre de l'onglet
  // (<title>) selon la donnée "title" définie sur la route active la plus profonde
  // (ex. "Contactez Piyole"), avec un titre par défaut si aucune n'est spécifiée.
  ngOnInit(){
    this.js.jsAppComponent();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route?.snapshot.data['title'] || 'Piyole | Immobilier et Construction | Guinée Conakry';
      })
    ).subscribe(title => {
      this.titleService.setTitle(title);
    });
  }
}
