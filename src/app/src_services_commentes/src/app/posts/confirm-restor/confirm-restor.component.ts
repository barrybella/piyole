import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Router } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { ContratService } from 'src/app/services/contrat.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirm-restor',
  templateUrl: './confirm-restor.component.html',
  styleUrls: ['./confirm-restor.component.css']
})
export class ConfirmRestorComponent implements OnInit {
  etatPadding: boolean = false;
  passwordIncorect: boolean = false;
  post?: Post;

  constructor(public dialogRef: MatDialogRef<ConfirmRestorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService, private userService: UserService, private postService: PostService, private router: Router, private _snackBar: SnackBarService) { }

  ngOnInit(): void {
    this.post = this.data.post; 
    // console.log("CONTRAT ", this.contrat);
  }

  controlForm = this.fb.group({
    // motif: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit(){
    this.etatPadding = true;
    let tel: string;
    tel = this.userService.getUserDetails().tel;
    var object = {
      login: tel,
      password: this.password?.value
    };

    this.userService.confirmPasswordLogin(object).subscribe(res => {
      if(!res){
        this.passwordIncorect = true;
        this.etatPadding = false;
      }else{ 
        this._snackBar.openSnackBar("Restoration en cours...", '');

       this.postService.restorePost(this.post._id).subscribe(res => {
          Swal.fire(
            'Restoré!!',
            'Post restoré avec success!!',
            'success'
          );
          this.dialogRef.close();
        })
      }
    });
  }

  get motif() {
    return this.controlForm.get('motif');
  }

  get password() {
    return this.controlForm.get('password');
  }
}
