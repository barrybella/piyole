import { SnackBarService } from 'src/app/services/snack-bar.service';
import { PostService } from 'src/app/services/post.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-what-post',
  templateUrl: './what-post.component.html',
  styleUrls: ['./what-post.component.css']
})
export class WhatPostComponent implements OnInit {
  post?: any;
  etatPadding: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, public dialogRef: MatDialogRef<WhatPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private postService: PostService, private userService: UserService, private _snackBar: SnackBarService) { }

  ngOnInit(): void {
  }

  controlForm = this.fb.group({
    postId: ['', [Validators.required,Validators.pattern(/^[0-9+]{1,}$/),]]
  });

  onSubmit(){
    this.getPostByPostId(this.postId?.value);
  }

  getPostByPostId(id: any){
    this.etatPadding = true; 

    this.postService.getPostByPostId(id).subscribe(res => {
      this._snackBar.openSnackBar("Chargement en cours...", "");
      if(res){
        this.etatPadding = false; 

        if(res.user_id?._id != this.userService.getUserDetails()._id){
          this.etatPadding = false; 
          Swal.fire(
            'Ça vous appartient pas!!',
            'Cet post ne vous appartient pas, c\'est pas vous qui lui a publié!!',
            'warning'
          );

          return;
        }
        this.post = res;
        // this.dialogRef.close();
        // this.post.name_user = res.user_id.name;
        // this.post.tel_user = res.user_id.tel;
        // this.post.role_user = res.user_id.role;
        
        // this.router.navigate(['posts/result-recherch-by-post-id', this.post]); 
        // this.router.navigate(['/posts/result-recherch-by-post-id'], { queryParams: { data: this.post },  skipLocationChange: true });
        
        // this.router.navigate(
        //   ['/posts/result-recherch-by-post-id'],
        //   { queryParams: this.post }
        //   );
        this.router.navigate(['posts/result-recherch-by-post-id', this.post?._id]);
      }else{
        this.etatPadding = false;
        Swal.fire(
          'Inexistant',
          'Cet numero de post n\'existe pas!',
          'info'
        );
      }
    })
  }

  get postId(){
    return this.controlForm.get('postId');
  }
}
