import { LoadingBarService } from '@ngx-loading-bar/core';
import { ConfirmPasswordComponent } from './../../confirm-password/confirm-password.component';
import { Router } from '@angular/router';
import { WhatPostComponent } from './../what-post/what-post.component';
import { PrintService } from 'src/app/services/print.service';
import { UserService } from './../../services/user.service';
import { Post } from './../../interfaces/post';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Socket } from 'ngx-socket-io';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { AddDevisComponent } from '../add-devis/add-devis.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  p: number = 1;
  posts: Post[] = [];
  posts_gards: Post[] = [];
  postValides: Post[] = [];
  postVerifications: Post[] = [];
  postLocations: Post[] = [];
  postVentes: Post[] = [];
  plans: Post[] = [];

  

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private postService: PostService, public userService: UserService, public print: PrintService, private socket: Socket, private dialog: MatDialog, private _snackBar: SnackBarService, private router: Router, private loadingBar: LoadingBarService) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit() {
    this.loadingBar.start();
    this.socket.on('postList', () => {
      this.getPostsByUserId();
    })
    this.getPostsByUserId();
  }

  /**
   * Récupère les annonces associées à l'utilisateur courant.
   */
  getPostsByUserId(){
    this.postService.getPostsByUser(this.userService.getUserDetails()._id).subscribe(res => {
      this.posts = res;
      this.loadingBar.complete();
      this.posts_gards = res;

      this.postValides = this.posts.filter(response => {
        return response.active == true;
      });

      this.postVerifications = this.posts.filter(response => {
        return response.active == false;
      });

      this.postLocations = this.posts.filter(response => {
        return response.type == 0;
      });

      this.postVentes = this.posts.filter(response => {
        return response.type == 1;
      });

      this.plans = this.posts.filter(response => {
        return response.type == 2;
      });
      console.log('POSTS ', this.posts);
      
    });
  }

  /**
   * Publie l'élément sélectionné.
   */
  onPublie(){
    this.posts = [];
    this.posts = this.posts_gards.filter(response => {
      return response.active == true;
    });
  }

  /**
   * Traite l'action liée à la location.
   */
  onLoc(){
    this.posts = [];

    this.posts = this.posts_gards.filter(response => {
      return response.type == 0;
    });
  }

  /**
   * Traite l'action liée à la vente.
   */
  onVente(){
    this.posts = [];

    this.posts = this.posts_gards.filter(response => {
      return response.type == 1;
    });
  }

  /**
   * Lance ou traite la vérification de l'élément sélectionné.
   */
  onVerification(){
    this.posts = [];

    this.posts = this.posts_gards.filter(response => {
      return response.active == false;
    });
  }

  /**
   * Traite l'affichage ou la gestion des plans.
   */
  onPlans(){
    this.posts = [];

    this.posts = this.posts_gards.filter(response => {
      return response.type == 2;
    });
  }

  /**
   * Traite l'affichage ou le regroupement de l'ensemble des éléments.
   */
  all(){
    this.posts = [];

    this.posts = this.posts_gards;
  }

  /**
   * Compte le nombre de contacts associés aux annonces.
   */
  countContact(post: Post){
    var i = 0;
    post.contact.forEach(res => {
      if(res.status == 1){
        i++;
      }
    });
    return i;
  }

  /**
   * Exécute le traitement associé à la méthode « onGetDevis ».
   */
  onGetDevis(post: Post){
    this._snackBar.openSnackBar("Chargment du devie en cours...", "");
    
    this.print.pdf(post.pdf);
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
   * Annule l'opération en cours et rétablit l'état approprié.
   */
  onCancel(post: Post){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête enttrain de d\'annuler cet post!!!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, annulez-le !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialog.open(ConfirmPasswordComponent, {
          data: {post: post},
          width: '400px'
        })
      }
    })
  }

  /**
   * Détermine la route de redirection en fonction du contexte.
   */
  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  /**
   * Restaure l'élément sélectionné depuis son état actuel ou la corbeille.
   */
  onRestore(id: any){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête enttrain de de restorer cet post!!!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, restorez-le !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this._snackBar.openSnackBar("Restoration en cours...", '');
        this.postService.restorePost(id).subscribe(res => {
          Swal.fire(
            'Restoré!!',
            'Post restoré avec success!!',
            'success'
          );
        })
      }
    })
  }

  /**
   * Supprime le document PDF associé à l'élément sélectionné.
   */
  onDeletePdf(post: Post){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête enttrain de de supprimer le DEVIS!!!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this._snackBar.openSnackBar("Restoration en cours...", '');
        this.postService.deletePdf(post._id).subscribe(res => {
          Swal.fire(
            'Supprimé!!',
            'Devis supprimé avec succès!!',
            'success'
          );
        })
      }
    })
  }

  /**
   * Prépare l'ajout d'un devis pour l'élément sélectionné.
   */
  onAddDevis(post: Post){
    this.dialog.open(AddDevisComponent, {
      data: {post: post},
      width: '500px'
    })
  }

  /**
   * Affiche les détails de l'élément sélectionné.
   */
  onDetail(id: any){
    this.router.navigate(['posts/result-recherch-by-post-id', id]);
  }

  /**
   * Lance la procédure de suppression du compte utilisateur.
   */
  onDeleteAcount(){
    this.userService.deleteAccount().subscribe(res => {
      console.log("OK OK");
      
    })
  }

  /**
   * Libère les ressources et nettoie les abonnements avant la destruction du composant.
   */
  ngOnDestroy(){
    this.loadingBar.complete();
  }
}
