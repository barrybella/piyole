import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

// Boîte de dialogue de changement de mot de passe pour un utilisateur déjà connecté
// (accessible depuis le menu latéral). Exige la saisie de l'ancien mot de passe
// avant d'autoriser la définition du nouveau, par mesure de sécurité.
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  user?: User;
  etatPadding: boolean = false;

  constructor(public dialogRef: MatDialogRef<UpdatePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private route: ActivatedRoute, private postService: PostService, private userService: UserService, private router: Router) { }

  // Méthode ngOnInit : gère la logique métier associée à cette opération.
  ngOnInit() {
  }

  // Formulaire réactif : ancien mot de passe (pour vérification) et nouveau mot de
  // passe (avec une longueur minimale de 6 caractères).
  controlForm = this.fb.group({
    password: ['', {
      validators: [
      Validators.required,
    ]}
    ],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });


  // Vérifie l'ancien mot de passe auprès du serveur. S'il est incorrect, affiche
  // une erreur. S'il est correct, met à jour le mot de passe avec la nouvelle
  // valeur saisie, affiche une confirmation et ferme la boîte de dialogue.
  onSubmit(){
    this.etatPadding = true; 
    var objectForm = {
      "password": this.newPassword?.value
    }

    let tel: string;
    tel = this.userService.getUserDetails().tel;
    var object = {
      login: tel,
      password: this.password?.value
    };

    this.userService.confirmPasswordLogin(object).subscribe(res => {
      if(!res){
        Swal.fire("Incorect!!", "Ancien mot de passe incorect!!", "warning");
        this.etatPadding = false;
      }else{ 
        this.userService.updatePassword(this.userService.getUserDetails()._id, objectForm).subscribe(res => {
          Swal.fire("Modifié", "Modification mot de passe reuissie!!", "success");
          this.dialogRef.close();
        })
      }
    });
  }

 

  // Retourne le message d'erreur pour le champ "ancien mot de passe" s'il est vide.
  getPasswordError(){
    if(this.password.invalid && (this.password.dirty || this.password.touched)){
      if(this.password.errors.required){
        return "Le mot de passe est requis!!";
      }
    }
  }

  // Indique si le champ "ancien mot de passe" est valide (pour affichage visuel de succès).
  getPasswordSuccess(){
    if(this.password.valid){
      return true;
    }
  }

  // Retourne le message d'erreur approprié pour le nouveau mot de passe
  // (champ vide ou trop court).
  getNewPasswordError(): any {
    if (this.newPassword?.invalid && (this.newPassword.dirty || this.newPassword.touched)) {
      if (this.newPassword.errors?.['required']) {
        return 'Mot de passe requis!';
      }else if(this.newPassword.errors.minlength){
        return 'Minimun 6 caractères!!';
      }
    }
  }

  // Indique si le nouveau mot de passe est valide (pour affichage visuel de succès).
  getNewPasswordSuccess(): any {
    if (this.newPassword?.valid) {
      return true;
    }
  }

  get password(){
    return this.controlForm.get('password');
  }

  get newPassword(){
    return this.controlForm.get('newPassword');
  }


}
