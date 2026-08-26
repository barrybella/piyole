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
  // dtOptions: DataTables.Settings = {};

  posts: Post[] = [];
  posts_gards: Post[] = [];
  postValides: Post[] = [];
  postVerifications: Post[] = [];
  postLocations: Post[] = [];
  postVentes: Post[] = [];
  plans: Post[] = [];

  

  constructor(private postService: PostService, public userService: UserService, public print: PrintService, private socket: Socket, private dialog: MatDialog, private _snackBar: SnackBarService, private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit() {
    this.loadingBar.start();
    this.socket.on('postList', () => {
      this.getPostsByUserId();
    })
    this.getPostsByUserId();
  }

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

  onPublie(){
    this.posts = [];
    this.posts = this.posts_gards.filter(response => {
      return response.active == true;
    });
  }

  onLoc(){
    this.posts = [];

    this.posts = this.posts_gards.filter(response => {
      return response.type == 0;
    });
  }

  onVente(){
    this.posts = [];

    this.posts = this.posts_gards.filter(response => {
      return response.type == 1;
    });
  }

  onVerification(){
    this.posts = [];

    this.posts = this.posts_gards.filter(response => {
      return response.active == false;
    });
  }

  onPlans(){
    this.posts = [];

    this.posts = this.posts_gards.filter(response => {
      return response.type == 2;
    });
  }

  all(){
    this.posts = [];

    this.posts = this.posts_gards;
  }
  
  // getPostsDeletedByUser(){
  //   this.postService.getPostsDeletedByUser(this.userService.getUserDetails()._id).subscribe(res => {
  //     this.postDeletes = res;
  //   })
  // }

  countContact(post: Post){
    var i = 0;
    post.contact.forEach(res => {
      if(res.status == 1){
        i++;
      }
    });
    return i;
  }

  onGetDevis(post: Post){
    this._snackBar.openSnackBar("Chargment du devie en cours...", "");
    
    this.print.pdf(post.pdf);
  }

  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }

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

  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

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

  onAddDevis(post: Post){
    this.dialog.open(AddDevisComponent, {
      data: {post: post},
      width: '500px'
    })
  }

  onDetail(id: any){
    this.router.navigate(['posts/result-recherch-by-post-id', id]);
  }

  onDeleteAcount(){
    this.userService.deleteAccount().subscribe(res => {
      console.log("OK OK");
      
    })
  }

  ngOnDestroy(){
    this.loadingBar.complete();
  }
}
