import { LoadingBarService } from '@ngx-loading-bar/core';
import { WhatPostComponent } from './../what-post/what-post.component';
import { PrintService } from './../../services/print.service';
import { VoirPlusComponent } from './../../voir-plus/voir-plus.component';
import { OnConfirmContactComponent } from './../on-confirm-contact/on-confirm-contact.component';
import { async } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-making-contact',
  templateUrl: './making-contact.component.html',
  styleUrls: ['./making-contact.component.css']
})
export class MakingContactComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  contacts: any[] = [];
  p: number = 1;

  constructor(private postService: PostService, private userService: UserService, private router: Router, private dialog: MatDialog, private socket: Socket, private _snackBar: MatSnackBar, public print: PrintService, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.getContacts();
    this.socket.on('contacts', () => {
     this.getContacts(); 
    })
  }

  getContacts(){
    this.loadingBar.start();
    this.postService.getContactAttenteUser().subscribe(res => {
      this.posts = res;
      this.loadingBar.complete();
    })
  }


   onVoirPlus(text: any){
    this.dialog.open(VoirPlusComponent, {
      data: {text: text},
      width: '500px'
    })
  }

  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }

  getTypePost(type: any){
    if(type == 0){
      type = 'Location';
    }else if(type == 1){
      type = 'Vente';
    }
    return type;
  }
  
  onDecline(post: any){
    this.alert(post);
  }

  alert(post: any){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête entrain d'annuler ce contact!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, declinez-le !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this._snackBar.open("Declinaison en cours...", ''), {
          duration: 5000,
        };
        this.onYes(post);
      }
    })
  }

  onYes(post: any){
    
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

  onValide(post: any){
    this.dialog.open(OnConfirmContactComponent, {
      data: {"post": post},
      width: '600px',
      disableClose: true
    })

  }

  ngOnDestroy(){
    this.loadingBar.complete();
  }
}

