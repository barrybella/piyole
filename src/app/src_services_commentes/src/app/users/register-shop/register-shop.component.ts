import { emailValidatorRegister } from 'src/app/validators/email-validator-register';
import { UserService } from './../../services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { telValidatorRegister } from 'src/app/validators/tel-register.validator';
import Swal from 'sweetalert2';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { AddBasketComponent } from 'src/app/shops/add-basket/add-basket.component';
import { HttpClient } from '@angular/common/http';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';

@Component({
  selector: 'app-register-shop',
  templateUrl: './register-shop.component.html',
  styleUrls: ['./register-shop.component.css']
})
export class RegisterShopComponent implements OnInit {
  etatPadding: boolean = false;
  @Input() shop;
  countries: any[] = [];
  print_countries: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private snackBar: SnackBarService, private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit() {
    this.print_countries = false;
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(
      (response) => {
        this.print_countries = true;
        this.countries = response.filter(resp => {
          return resp.translations.fra.common != 'Antarctique';
        });
        console.log("COUNTRY ", this.countries);
        
        this.countries.sort((a, b) => a.name.common.localeCompare(b.translations.fra.common));
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    tel: ['', {
      validators: [
      Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^[0-9+]{6,}$/)
    ],
      asyncValidators: [telValidatorRegister(this.userService)]}
    ],
    code: ['', {
      validators: [
      Validators.required
    ]}
    ],
    role: ['user'],
    email: ['', {
      validators: [
       Validators.required, Validators.email
     ],
      asyncValidators: [emailValidatorRegister(this.userService)]
    }
   ],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(){
    this.etatPadding = true;
    
    this.userService.register(this.registerForm.value).subscribe(res => {
      // Swal.fire({
      //   position: 'top-end',
      //   icon: 'success',
      //   title: 'Enregistrement Reuissie!',
      //   showConfirmButton: false,
      //   timer: 2000
      // })
      // this.router.navigate(['users/profile']);
      this.snackBar.openSnackBar("Enregistrement reuisie!!", "Fermer");
      // console.log("SHOP ", this.shop);
      this.dialog.closeAll();
      this.dialog.open(AddBasketComponent, {
        data: {shop: this.shop},
        width: '500px'
      })
    })
  }

  getTelError(){
    if(this.tel.invalid && (this.tel.dirty || this.tel.touched)){
      if(this.tel.errors.required){
        return "Le telephone est requis!!";
      }else if(this.tel.errors.minlength){
        return 'Trop petit!!';
      }else if(this.tel.errors.pattern){
        return 'Telephone incorect!!';
      }else if(this.tel.errors.telExist){
        return 'Cet Telephone est dejat utilisé!!';
      }
    }
  }

  getTelSuccess(){
    if(this.tel.valid){
      return true;
    }
  }

  getNameError(){
    if(this.name.invalid && (this.name.dirty || this.name.touched)){
      if(this.name.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  getNameSuccess(){
    if(this.name.valid){
      return true;
    }
  }

  getCodeError(){
    if(this.code.invalid && (this.code.dirty || this.code.touched)){
      if(this.code.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  getCodeSuccess(){
    if(this.code.valid){
      return true;
    }
  }


  getEmailError(): any {
    if (this.email?.invalid && (this.email.dirty || this.email.touched)) {
      if (this.email.errors?.['required']) {
        return 'L\'adresse email est requise!';
      }else if(this.email.errors?.['email']){
        return 'Email incorrecte!!';
      }else if(this.email.errors?.['emailExist']){
        return 'Cet Email existe dejàt!!';
      }
    }
  }

  getEmailSuccess(): any {
    if (this.email?.valid) {
      return true;
    }
  }

  get code(){
    return this.registerForm.get('code');
  }

  get tel(){
    return this.registerForm.get('tel');
  }

  get name(){
    return this.registerForm.get('name');
  }

  get email(){
    return this.registerForm.get('email');
  }
}
