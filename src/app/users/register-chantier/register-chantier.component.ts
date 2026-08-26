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
import { AddChantierComponent } from 'src/app/contrats/add-chantier/add-chantier.component';

// Variante du formulaire d'inscription, utilisée depuis le contexte de suivi de
// chantier : mêmes champs que RegisterComponent, mais à la fin de l'inscription,
// ouvre directement le formulaire d'ajout de chantier plutôt que de rediriger
// vers le profil.
@Component({
  selector: 'app-register-chantier',
  templateUrl: './register-chantier.component.html',
  styleUrls: ['./register-chantier.component.css']
})
export class RegisterChantierComponent implements OnInit {
  etatPadding: boolean = false;
  @Input() shop;
  countries: any[] = [];
  print_countries: boolean = false;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private snackBar: SnackBarService, private dialog: MatDialog, private http: HttpClient) { }

  // Récupère la liste des pays (hors Antarctique) depuis l'API REST Countries,
  // triée par nom français.
  ngOnInit() {
    this.print_countries = false;
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

  // Formulaire réactif d'inscription, identique à celui de RegisterComponent.
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

  // Crée le compte, puis ferme toutes les boîtes de dialogue ouvertes et rouvre
  // directement celle d'ajout de chantier.
  onSubmit(){
    this.etatPadding = true;
    
    this.userService.register(this.registerForm.value).subscribe(res => {
    
      this.snackBar.openSnackBar("Enregistrement reuisie!!", "Fermer");
      this.dialog.closeAll();
      this.dialog.open(AddChantierComponent, {
        width: '500px'
      })
    })
  }

  // Retourne le message d'erreur approprié pour le champ téléphone.
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

  // Retourne le message d'erreur pour le champ code s'il est vide.
  getCodeError(){
    if(this.code.invalid && (this.code.dirty || this.code.touched)){
      if(this.code.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  // Indique si le champ code est valide (pour affichage visuel de succès).
  getCodeSuccess(){
    if(this.code.valid){
      return true;
    }
  }


  // Retourne le message d'erreur approprié pour le champ email.
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
