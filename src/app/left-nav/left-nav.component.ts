import { Socket } from 'ngx-socket-io';
import { PrintService } from 'src/app/services/print.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { UpdatePasswordComponent } from '../update-password/update-password.component';
import { MatDialog } from '@angular/material/dialog';

// Composant de menu latéral, affiché dans les espaces connectés (agence/administration).
// Affiche le profil utilisateur, le compteur de contacts en attente (mis à jour en
// temps réel via WebSocket), et gère la navigation, la déconnexion et le changement
// de mot de passe.
@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements OnInit {
  user?: any;
  contact_prise: number = 0;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(public userService: UserService, private router: Router, public print: PrintService, private socket: Socket, private postService: PostService, private dialog: MatDialog) { }
  
  // Charge les données initiales (utilisateur, compteur de contacts), puis s'abonne
  // aux événements WebSocket "userList" et "contacts" pour les rafraîchir automatiquement
  // dès qu'un changement survient côté serveur.
  ngOnInit() {
    this.getUser();
    this.countContactAttenteUser();
    this.socket.on('userList', () => {
      this.getUser(); 
     });

     this.socket.on('contacts', () => {
       this.countContactAttenteUser();
     });
  }

  // Récupère les informations à jour de l'utilisateur actuellement connecté.
  getUser(){
    this.userService.getUserById(this.userService.getUserDetails()._id).subscribe(res => {
      this.user = res;
    })
  }

  // Récupère le nombre de contacts en attente de confirmation pour l'utilisateur connecté.
  countContactAttenteUser(){
    this.postService.countContactAttenteUser().subscribe(res => {
      this.contact_prise = res;
    });
  }

  // Détermine si une route donnée correspond à la route actuellement affichée,
  // pour appliquer un style visuel "actif" sur l'élément de menu correspondant.
  getActive(route: any): any{
    if(route == this.router.url){
      return 'active';
    }
  }

  // Navigue vers la route donnée.
  onRedirect(route: any){
    this.router.navigate([route]);
  }

  // Déconnecte l'utilisateur courant.
  onDeconexion(){
    this.userService.logout();
  }

  // Ouvre la boîte de dialogue de changement de mot de passe.
  onUpdatePassword(){
    this.dialog.open(UpdatePasswordComponent, {
      width: '400px'
    })
  }

}
