import { SnackBarService } from 'src/app/services/snack-bar.service';
import { PostService } from 'src/app/services/post.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cherch-ref',
  templateUrl: './cherch-ref.component.html',
  styleUrls: ['./cherch-ref.component.css']
})
export class CherchRefComponent implements OnInit {
  post?: any;
  etatPadding: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, public dialogRef: MatDialogRef<CherchRefComponent>,
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

    this.postService.cherchPostWeb(id).subscribe(res => {
      this._snackBar.openSnackBar("Chargement en cours...", "");
      if(res){
        this.etatPadding = false; 

        if(res.status == 1){
          this.etatPadding = false; 
          Swal.fire(
            'Dejat Pris!!',
            'Cet post a dejat eté pris par un autre',
            'info'
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
        this.router.navigate(['posts/detail-post', this.post?._id]);
      }else{
        this.etatPadding = false;
        Swal.fire(
          'Inexistant',
          'Cettte reference n\'existe pas!',
          'info'
        );
      }
    })
  }

  get postId(){
    return this.controlForm.get('postId');
  }
}
