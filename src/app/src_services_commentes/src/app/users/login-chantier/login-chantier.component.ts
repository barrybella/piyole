import { PrintService } from 'src/app/services/print.service';
import { UserService } from './../../services/user.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordComponent } from 'src/app/forget-password/forget-password.component';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddBasketComponent } from 'src/app/shops/add-basket/add-basket.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { AddChantierComponent } from 'src/app/contrats/add-chantier/add-chantier.component';

@Component({
  selector: 'app-login-chantier',
  templateUrl: './login-chantier.component.html',
  styleUrls: ['./login-chantier.component.css']
})
export class LoginChantierComponent implements OnInit {
  passwordIncorect: boolean = false;
  etatPadding: boolean = false;

  constructor(public dialogRef: MatDialogRef<LoginChantierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder, private userService: UserService, private router: Router, public print: PrintService, private dialog: MatDialog, private snackBar: SnackBarService) { }

  ngOnInit(): void {
  }

  loginForm = this.fb.group({
    login: ['', {
      validators: [
       Validators.required,
     ]}
   ],
    password: ['', [Validators.required]]
  })

  onSubmit(){
    this.etatPadding = true; 
    this.userService.loginWeb(this.loginForm.value).subscribe(res => {
      if(!res){
        this.passwordIncorect = true;
        this.etatPadding = false;
      }else{
        if(this.userService.getUserDetails()?.role != 'user'){
          this.print.notifications("Vous n'avez pas le role utilisateur!!", 6000, 'warning');
          this.router.navigate(['home']);
          this.userService.logout();
          return;
          
        }
        this.snackBar.openSnackBar("Connexion reuisie!!", "Fermer");
        // console.log("SHOP ", this.shop);
        this.dialog.closeAll();
        this.dialog.open(AddChantierComponent, {
          width: '500px'
        })
        // this.router.navigate(['/posts/dashboard']);
      }
    })
  }

  onClick(){
    this.dialog.open(ForgetPasswordComponent, {
      width: '500px'
    })
  }
}
