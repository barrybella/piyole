import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  user?: User;
  etatPadding: boolean = false;

  constructor(public dialogRef: MatDialogRef<ForgetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private route: ActivatedRoute, private postService: PostService, private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  controlForm = this.fb.group({
    // tel: ['', {
    //   validators: [
    //   Validators.required,
    //   Validators.minLength(6),
    //   Validators.pattern(/^[0-9+]{6,}$/)
    // ]}
    // ],
    email: ['', [Validators.required, Validators.email]]
  });


  onSubmit(){
    this.etatPadding = true; 
    this.userService.testIfCanRenitialisedPassword(this.email.value).subscribe(res => {
      if(res){
        Swal.fire("Code envoyé!", "Nous avons envoyer un code sur votre telephone", "info");
        this.router.navigate(['reset-password', res._id]);
      }else{
        Swal.fire("Impossible!!", "Cet email n'existe pas!!", "warning");
        this.etatPadding = false; 
      }
    })
  }

  contactMe(){
    this.postService.setContactPost(this.data.post._id, this.controlForm.value).subscribe(res => {
      this.etatPadding = false;
      this.dialogRef.close();
      Swal.fire(
        'Contact Effectuer!',
        'Vous allez recevoir un message de confirmation!',
        'success'
      );
    })
  }

  getTelError(){
    if(this.tel.invalid && (this.tel.dirty || this.tel.touched)){
      if(this.tel.errors.required){
        return "Le telephone est requis!!";
      }else if(this.tel.errors.minLength){
        return 'Minimun 6 chiffre!!';
      }else if(this.tel.errors.telExist){
        this.user = this.tel.errors.telExist.value;
        this.tel.setErrors(null);                                                                                                                                                                                                                                                                                                                                                                                            
      }else if(this.tel.errors.codeErr){
        return 'Code telephone incorect!!';
      }else if(this.tel.errors.pattern){
        return 'Minimum 9 chiffres!!';
      }
    }
  }

  getTelSuccess(){
    if(this.tel.valid){
      return true;
    }
  }

  getEmailError(): any {
    if (this.email?.invalid && (this.email.dirty || this.email.touched)) {
      if (this.email.errors?.['required']) {
        return 'L\'adresse email est requise!';
      }else if(this.email.errors?.['email']){
        return 'Email incorrecte!!';
      }
    }
  }

  getEmailSuccess(): any {
    if (this.email?.valid) {
      return true;
    }
  }

  get tel(){
    return this.controlForm.get('tel');
  }

  get email(){
    return this.controlForm.get('email');
  }

  get message(){
    return this.controlForm.get('message');
  }

}
