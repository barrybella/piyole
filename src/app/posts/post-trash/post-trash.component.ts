import { LoadingBarService } from '@ngx-loading-bar/core';
import { ConfirmRestorComponent } from './../confirm-restor/confirm-restor.component';
import Swal from 'sweetalert2';
import { PrintService } from 'src/app/services/print.service';
import { PostService } from 'src/app/services/post.service';
import { Post } from './../../interfaces/post';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WhatPostComponent } from './../what-post/what-post.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-post-trash',
  templateUrl: './post-trash.component.html',
  styleUrls: ['./post-trash.component.css']
})
export class PostTrashComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  p: number = 1;

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private dialog: MatDialog, private router: Router, private postService: PostService, public print: PrintService, private socket: Socket, private loadingBar: LoadingBarService) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void {
    this.getPosts();
    this.socket.on('postList', () => {
      this.getPosts();
    })
  }

  /**
   * Récupère la liste des annonces correspondant aux critères courants.
   */
  getPosts(){
    this.loadingBar.start();
    this.postService.getTrashPosts().subscribe(res => {
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
   * Détermine la route de redirection en fonction du contexte.
   */
  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  /**
   * Redirige l'utilisateur vers la page correspondante.
   */
  onRedirect(route: any, id: any){
    this.router.navigate([route, id]);
  }

  /**
   * Affiche les détails de l'élément sélectionné.
   */
  onDetail(id: any){
    this.router.navigate(['posts/result-recherch-by-post-id', id]);
  }

  /**
   * Exécute le traitement associé à la méthode « onDetailContrat ».
   */
  onDetailContrat(contrat: any){
    this.router.navigate(['contrats/detail-contrat', contrat._id]);
  }

  /**
   * Restaure l'élément sélectionné depuis son état actuel ou la corbeille.
   */
  onRestore(post: any){
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
        this.dialog.open(ConfirmRestorComponent, {
          data: {post: post},
          width: '400px'
        })
      }
    })
  } 

  /**
   * Libère les ressources et nettoie les abonnements avant la destruction du composant.
   */
  ngOnDestroy(){
    this.loadingBar.complete();
  }

}
