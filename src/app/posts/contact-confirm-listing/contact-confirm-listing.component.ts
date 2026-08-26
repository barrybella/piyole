import { LoadingBarService } from '@ngx-loading-bar/core';
import { WhatPostComponent } from './../what-post/what-post.component';
import { AddContratForSaleComponent } from './../../contrats/add-contrat-for-sale/add-contrat-for-sale.component';
import { AddEntretienComponent } from './../add-entretien/add-entretien.component';
import { PrintService } from 'src/app/services/print.service';
import { UpdateContactConfirmComponent } from './../update-contact-confirm/update-contact-confirm.component';
import { VoirPlusComponent } from './../../voir-plus/voir-plus.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Post } from 'src/app/interfaces/post';
import { User } from 'src/app/interfaces/user';
import { PostService } from 'src/app/services/post.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-contact-confirm-listing',
  templateUrl: './contact-confirm-listing.component.html',
  styleUrls: ['./contact-confirm-listing.component.css']
})
export class ContactConfirmListingComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  contacts: any[] = [];
  p: number = 1;

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private postService: PostService, private userService: UserService, private router: Router, private dialog: MatDialog, private _snackBar: SnackBarService, private socket: Socket, public print: PrintService, private loadingBar: LoadingBarService) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void {
    this.getContacts();
    this.socket.on('contacts', () => {
      this.getContacts();
    })
  }

  /**
   * Récupère les contacts ou demandes associés à l'utilisateur courant.
   */
  getContacts(){
    this.loadingBar.start();
    this.postService.getContactConfirmUser().subscribe(res => {
      this.posts = res;
      this.loadingBar.complete();
    })
  }

  /**
   * Détermine le type ou la nature de l'annonce sélectionnée.
   */
  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }

  /**
   * Met à jour les données de l'élément sélectionné.
   */
  onUpdate(post){
    this.dialog.open(UpdateContactConfirmComponent, {
      data: {post: post},
      width: '600px',
      disableClose: true
    })
  }
  
  /**
   * Prépare l'ajout d'un entretien.
   */
  onAddEntretient(post: any){
    if(post.type == 0){
      this.dialog.open(AddEntretienComponent, {
        data: {post: post},
        width: '900px',
        disableClose: true
      });
    }else{
      this.dialog.open(AddContratForSaleComponent, {
        data: {post: post},
        width: '700px',
        disableClose: true
      });
    }
  }
  

  /**
   * Refuse ou décline l'opération sélectionnée.
   */
  onDecline(post: any){
    this.alert(post);
  }

  /**
   * Exécute le traitement associé à la méthode « alert ».
   */
  alert(post: any){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous decliner cette prise en contact!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, declinez-le !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this._snackBar.openSnackBar("Declinaison en cours...", '');
        this.onYes(post);
      }
    })
  }

  /**
   * Confirme l'action demandée par l'utilisateur.
   */
  onYes(post: any){
    console.log("CONTACT ", post);
    
    this.postService.declineContact(post._id, post.contact._id).subscribe(res => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Declinaison Reuissie!',
        showConfirmButton: false,
        timer: 2000
      })
    })
  }

  /**
   * Affiche davantage d'informations ou de résultats.
   */
  onVoirPlus(text: any){
    this.dialog.open(VoirPlusComponent, {
      data: {text: text},
      minWidth: '400px'
    })
  }

  /**
   * Détermine le type de l'annonce courante.
   */
  getTypePost(type: any){
    if(type == 0){
      type = 'Location';
    }else if(type == 1){
      type = 'Vente';
    }
    return type;
  }

  /**
   * Affiche les détails de l'élément sélectionné.
   */
  onDetail(id: any){
    this.router.navigate(['posts/result-recherch-by-post-id', id]);
  }

   /**
    * Libère les ressources et nettoie les abonnements avant la destruction du composant.
    */
   ngOnDestroy(){
    this.loadingBar.complete();
  }

}
