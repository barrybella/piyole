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

  constructor(private dialog: MatDialog, private router: Router, private postService: PostService, public print: PrintService, private socket: Socket, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.getPosts();
    this.socket.on('postList', () => {
      this.getPosts();
    })
  }

  getPosts(){
    this.loadingBar.start();
    this.postService.getTrashPosts().subscribe(res => {
      this.posts = res;
      this.loadingBar.complete();
    })
  }

  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }

  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  onRedirect(route: any, id: any){
    this.router.navigate([route, id]);
  }

  onDetail(id: any){
    this.router.navigate(['posts/result-recherch-by-post-id', id]);
  }

  onDetailContrat(contrat: any){
    this.router.navigate(['contrats/detail-contrat', contrat._id]);
  }

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

  ngOnDestroy(){
    this.loadingBar.complete();
  }

}
