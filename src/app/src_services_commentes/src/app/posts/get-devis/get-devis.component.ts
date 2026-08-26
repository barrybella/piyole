import { Location } from '@angular/common';
import { SnackBarService } from './../../services/snack-bar.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { VoirPlusComponent } from 'src/app/voir-plus/voir-plus.component';
import { PrintService } from 'src/app/services/print.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-get-devis',
  templateUrl: './get-devis.component.html',
  styleUrls: ['./get-devis.component.css']
})
export class GetDevisComponent implements OnInit {
  devis: any[] = [];
  post: any;

  constructor(private postService: PostService, private route: ActivatedRoute, public print: PrintService, private dialog: MatDialog, private socket: Socket, private _snackBar: SnackBarService, private location: Location) { }

  ngOnInit(): void {
    this.getPost();
    this.socket.on('devi_emit', () => {
      this.getPost();
    })
  }

  getPost(): any {
    var id = this.route.snapshot.paramMap.get('id');
    this.postService.getPost(id).subscribe(res => {
      this.post = res;
      this.devis = res.devis.filter(resp => {
        return resp.delete == 0;
      });
    })
  }

  onVoirPlus(text: any){
    this.dialog.open(VoirPlusComponent, {
      data: {text: text},
      minWidth: '400px'
    })
  }

  onDelete(devi){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête enttrain de d\'annuler cet devi!!!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, annulez-le !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this._snackBar.openSnackBar("Suppresion en cours...", '');
        this.postService.deleteDevi(this.post?._id, devi._id, ).subscribe(res => {
          Swal.fire(
            'Annulé!!',
            'Vous avez annuler le post <span style="color: red;">' + this.post?.postId + '</span> !!',
            'success'
          );
        })
      }
    })
  }

  onBack(){
    this.location.back();
  }
}
