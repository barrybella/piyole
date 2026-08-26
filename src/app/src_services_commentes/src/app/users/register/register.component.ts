import { emailValidatorRegister } from 'src/app/validators/email-validator-register';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { telValidatorRegister } from 'src/app/validators/tel-register.validator';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  etatPadding: boolean = false;
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private http: HttpClient, private countryService: CountryService) { }
  countries: any[] = [];
  print_countries: boolean = false;

  ngOnInit() {
    this.print_countries = false;
    
    // this.countryService.getCountries().subscribe(data => {
    //   // console.log("Hi ", data);
    //   // Transforme et trie les pays par ordre alphabétique
    //   this.countries = data.map(country => ({
    //       name: country.name.common,
    //       flag: country.flags.png
    //     })).sort((a, b) => a.name.localeCompare(b.name));
    //   });
     

    

    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(
      (response) => {
        this.print_countries = true;
        this.countries = response.filter(resp => {
          return resp.translations.fra.common != 'Antarctique';
        });
        this.countries.sort((a, b) => a.name.common.localeCompare(b.translations.fra.common));
        console.log("COUNTRY ", this.countries);
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
    role: ['user'],
    code: ['', {
      validators: [
      Validators.required,
    ]}
    ],
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
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Enregistrement Reuissie!',
        showConfirmButton: false,
        timer: 2000
      })
      this.router.navigate(['users/profile']);
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
