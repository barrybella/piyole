import { PrintService } from 'src/app/services/print.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordComponent } from 'src/app/forget-password/forget-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  passwordIncorect: boolean = false;
  etatPadding: boolean = false;
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, public print: PrintService, private dialog: MatDialog) { }

  ngOnInit() {
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
        // console.log("USR LOGI ", this.userService.getUserDetails());
        if(this.userService.getUserDetails()?.role != 'user'){
          this.print.notifications("Vous n'avez pas le role utilisateur!!", 6000, 'warning');
          this.router.navigate(['home']);
          this.userService.logout();
          return;

        }
        this.router.navigate(['/posts/dashboard']);
      }
    })
  }

  onClick(){
    this.dialog.open(ForgetPasswordComponent, {
      width: '500px'
    })
  }
}
