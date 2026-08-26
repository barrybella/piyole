import { LoadingBarService } from '@ngx-loading-bar/core';
import { ConfirmRestorComponent } from './../confirm-restor/confirm-restor.component';
import { Socket } from 'ngx-socket-io';
import { AddVideoComponent } from './../add-video/add-video.component';
import { ConfirmPasswordComponent } from './../../confirm-password/confirm-password.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { map } from 'rxjs/operators';
import { OnContactFromResultCherchComponent } from './../on-contact-from-result-cherch/on-contact-from-result-cherch.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PrintService } from 'src/app/services/print.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { OnConfirmContactComponent } from '../on-confirm-contact/on-confirm-contact.component';
import { AddVideoMobileComponent } from '../add-video-mobile/add-video-mobile.component';

@Component({
  selector: 'app-result-recherch-by-post-id',
  templateUrl: './result-recherch-by-post-id.component.html',
  styleUrls: ['./result-recherch-by-post-id.component.css']
})
export class ResultRecherchByPostIdComponent implements OnInit, OnDestroy {
  post?: any;
  result?: any

  constructor(private route: ActivatedRoute, private location: Location, public print: PrintService, public dialog: MatDialog, private postService: PostService, private router: Router, private _snackBar: SnackBarService, private socket: Socket, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    // this.getParams();
    this.socket.on('postList', () => {
      // alert("hello");
      this.getPost();
    })
    this.getPost()
  }

  getPost(){
    const id$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id'))
    );
    
    id$.subscribe(result => {
      this.getPostById(result); 
    })
  }

  // formatText(text: string): string {
  //   return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  // }

  formatText(text: string): string {
    return text.replace(/###\s*(.*?)(\n|$)/g, '<h4 style="font-size: 20px; ">$1</h4><br>').replace(/%%%\s*(.*?)(\n|$)/g, '<h5 style="font-size: 20px; ">$1</h5><br>').replace(/&&&\s*(.*?)(\n|$)/g, '<i style="font-size: 20px; ">$1</i><br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }


  printDesc(text: any){
    var texteAvecSautsDeLigne = text.replace(/\n/g, "<br>");
    return texteAvecSautsDeLigne;
  }

  getPostById(_id: any){
    this.loadingBar.start();
    var url = 'https://kanabah.herokuapp.com/';
    this.postService.getPostById(_id).subscribe(result => {
      this.loadingBar.complete();
      this.post = result;
      this.dialog.closeAll();
      if(this.post?.status == 1 && this.post?.active == 'true'){
        Swal.fire({
          icon: 'info',
          title: 'Dejat Pris...',
          text: 'Cet publication a dejat un contrat en cours!!',
          footer: '<a class="link" href="'+ url  +'">Voulez vous voir le contrat?</a>'
        })
      }else if(this.post?.active == 'false'){
        Swal.fire({
          icon: 'info',
          title: 'Validation en cours...',
          text: 'Cet publication est en cours de validation!!'
        });
      }
    })
  }

  getParams(){
    var url = 'https://kanabah.herokuapp.com/';
    this.route.queryParamMap
      .subscribe((params) => {
        this.post = params
        if(this.post?.params.status == 1 && this.post?.params.active == 'true'){
          Swal.fire({
            icon: 'info',
            title: 'Dejat Pris...',
            text: 'Cet publication a dejat un contrat en cours!!',
            footer: '<a class="link" href="'+ url  +'">Voulez vous voir le contrat?</a>'
          })
        }else if(this.post?.params.active == 'false'){
          Swal.fire({
            icon: 'info',
            title: 'Validation en cours...',
            text: 'Cet publication est en cours de validation!!'
          });
        }

        this.result =  this.post?.params;
        console.log('POST ', this.post?.params);
        
      }
    );
  }

  getTypePost(type_input: any){
    var type = '';
      if(type_input == 0 ){
        type = 'Location';
      }else if(type_input == 1 ){
        type = 'Vente';
      }else if(type_input == 2 ){
        type = 'Plan';
      }
    return type;
  }

  onConfirm(contact: any){
    this.dialog.open(OnContactFromResultCherchComponent, {
      data: {"contact": contact},
      minWidth: '600px'

    })
  }

  getResponse(value: any){
    if(value == true){
      return "Oui"
    }else{
      return "Non";
    }
  }

  getContacts(post: any){
    var i = 0;
    // console.log("POST ", post);
    post.contact.forEach(res => {
      if(res.status == 0 || res.status == 1){
        i = i + 1;
      }
    });
    return i;
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

  onDeleteVideo(post: Post){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête enttrain de supprimer la video cet post!!!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, annulez-le !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
         this._snackBar.openSnackBar("Suppresion en cours...", "");

        this.postService.deleteVideo(post._id).subscribe(res => {
          Swal.fire("Suprimé!!", "Video supprimé avec succès!!", "success");
        })
      }
    })
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

  AddVideo(post: any, title: string, button: string){
    this.dialog.open(AddVideoComponent, {
      width: '400px',
      data: {post: post, title: title, button: button},
    })
  }

  AddVideoMobile(post: any, title: string, button: string){
    this.dialog.open(AddVideoMobileComponent, {
      width: '400px',
      data: {post: post, title: title, button: button},
    })
  }

  onRedirect(route: any, id: any){
    this.router.navigate([route, id]);
  }

  onBack(){
    this.location.back();
  }

  ngOnDestroy(){
    this.loadingBar.complete();
  }
}
