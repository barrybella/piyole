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

// Formulaire d'inscription "standard" (client). Charge la liste des pays (pour un
// champ d'indicatif téléphonique, probablement) directement via HttpClient plutôt
// que via CountryService (dont l'appel est commenté — semble être une ancienne
// tentative remplacée par l'appel direct ci-dessous). Utilise des validateurs
// asynchrones pour vérifier en temps réel l'unicité du téléphone et de l'email.
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  etatPadding: boolean = false;
  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private http: HttpClient, private countryService: CountryService) { }
  countries: any[] = [];
  print_countries: boolean = false;

  // Récupère la liste des pays (hors Antarctique) depuis l'API REST Countries,
  // triée par nom français, pour peupler un sélecteur dans le formulaire.
  ngOnInit() {
    this.print_countries = false;
    
    //   // Transforme et trie les pays par ordre alphabétique
    //       name: country.name.common,
    //       flag: country.flags.png
     

    

    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(
      (response) => {
        this.print_countries = true;
        this.countries = response.filter(resp => {
          return resp.translations.fra.common != 'Antarctique';
        });
        this.countries.sort((a, b) => a.name.common.localeCompare(b.translations.fra.common));
      },
      (error) => {
      }
    );

  }

  // Formulaire réactif d'inscription : nom, téléphone (validé en temps réel pour
  // vérifier qu'il n'est pas déjà pris), rôle par défaut "user", code (indicatif
  // pays probablement), email (validé en temps réel également) et mot de passe
  // (minimum 6 caractères).
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

  // Crée le compte utilisateur, affiche une confirmation temporaire (toast) et
  // redirige vers la page de profil.
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

  // Retourne le message d'erreur approprié pour le champ téléphone, y compris
  // le cas où le numéro est déjà utilisé (détecté par le validateur asynchrone).
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

  // Indique si le champ téléphone est valide (pour affichage visuel de succès).
  getTelSuccess(){
    if(this.tel.valid){
      return true;
    }
  }

  // Retourne le message d'erreur pour le champ nom s'il est vide.
  getNameError(){
    if(this.name.invalid && (this.name.dirty || this.name.touched)){
      if(this.name.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  // Indique si le champ nom est valide (pour affichage visuel de succès).
  getNameSuccess(){
    if(this.name.valid){
      return true;
    }
  }


  // Retourne le message d'erreur approprié pour le champ email, y compris le cas
  // où l'email est déjà utilisé (détecté par le validateur asynchrone).
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

  // Indique si le champ email est valide (pour affichage visuel de succès).
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
