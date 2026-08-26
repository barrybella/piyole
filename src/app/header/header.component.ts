import { Router } from '@angular/router';
import { CherchRefComponent } from './../posts/cherch-ref/cherch-ref.component';
import { MatDialog } from '@angular/material/dialog';
import { ScriptStoreHome } from './../services/dynamic-loader.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { Socket } from 'ngx-socket-io';

// Composant d'en-tête (barre de navigation supérieure), affiché sur toutes les pages.
// Affiche l'utilisateur connecté, le nombre d'articles dans son panier (mis à jour
// en temps réel via WebSocket), et gère la déconnexion et l'ouverture de la recherche.
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  activeStatus: boolean = false;
  ok?: boolean = false;
  user?: User;
  count_bask: number = 0;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(public userService: UserService, private dialog: MatDialog, private router: Router, private socket: Socket) { }

  // Charge les informations de l'utilisateur au démarrage, et s'abonne à l'événement
  // WebSocket "add_basket_event" pour rafraîchir automatiquement le panier dès qu'un
  // article y est ajouté (depuis n'importe quel endroit de l'application).
  ngOnInit() {
    this.getUser();
    this.socket.on('add_basket_event', () => {
      this.getUser();
    })
  }

  // Récupère l'utilisateur connecté et recalcule le nombre d'articles actifs
  // (ni supprimés, ni déjà traités) dans son panier.
  getUser(){
    this.ok = false;
    this.count_bask = 0;
      this.userService.getUserByIdBasket().subscribe(res => {
        this.user = res;
        this.user.baskets.forEach(resp => {
          if(resp.delete == 0 && resp.status == 0){
            this.count_bask++;
            this.ok = true;
          }
        })
      })
  }

  // Déconnecte l'utilisateur courant.
  onDeconexion(){
    this.userService.logout();
  }

  // Navigue vers la route donnée.
  onRedirect(route: any){
    this.router.navigate([route])
  }

  // Ouvre la boîte de dialogue de recherche rapide (recherche de référence d'annonce).
  cherch(){
    this.dialog.open(CherchRefComponent, {
      width: '500px'
    })
  }
}
