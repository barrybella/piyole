import { PrintService } from 'src/app/services/print.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordComponent } from 'src/app/forget-password/forget-password.component';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  passwordIncorect: boolean = false;
  etatPadding: boolean = false;
  user?: any;
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, public print: PrintService, private dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {
    this.dialog.closeAll();
  }

  loginForm = this.fb.group({
    random: ['', {
      validators: [
       Validators.required,
     ]}
   ],
    password: ['', [Validators.required]]
  })

  onSubmit(){
    this.etatPadding = true;
    const id = this.route.snapshot.paramMap.get('id');

    this.userService.getUserById(id).subscribe(res => {
      this.user = res;
      // console.log("USER ", this.user);
      if(this.user.random == this.random?.value){
        this.userService.updatePassword(id, this.loginForm.value).subscribe(resp => {
          Swal.fire("Modifié!!", "Mot de passe modifié avec succès!!", "success");
          this.router.navigate(['users/login']);
        })
      }else{
        Swal.fire("Code Icorect!!", "Le code est icorect!!", "info");
        this.etatPadding = false;
      }
      
    })
  }

  get random(){
    return this.loginForm.get('random');
  }
}
