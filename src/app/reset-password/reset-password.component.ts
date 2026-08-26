import { PrintService } from 'src/app/services/print.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordComponent } from 'src/app/forget-password/forget-password.component';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

// Page de réinitialisation de mot de passe, accessible via un lien contenant
// l'identifiant utilisateur (voir app-routing.module.ts : reset-password/:id).
// Demande un code de vérification (random) reçu par l'utilisateur, ainsi que le
// nouveau mot de passe souhaité.
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  passwordIncorect: boolean = false;
  etatPadding: boolean = false;
  user?: any;
  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, public print: PrintService, private dialog: MatDialog, private route: ActivatedRoute) { }

  // Ferme toute boîte de dialogue éventuellement encore ouverte (ex. si l'utilisateur
  // arrive sur cette page depuis la boîte de dialogue "mot de passe oublié").
  ngOnInit() {
    this.dialog.closeAll();
  }

  // Formulaire réactif : code de vérification (random) et nouveau mot de passe.
  loginForm = this.fb.group({
    random: ['', {
      validators: [
       Validators.required,
     ]}
   ],
    password: ['', [Validators.required]]
  })

  // Récupère l'identifiant utilisateur depuis l'URL, charge son compte, puis vérifie
  // que le code saisi correspond bien au code attendu (stocké côté serveur). Si le
  // sinon, affiche une erreur.
  onSubmit(){
    this.etatPadding = true;
    const id = this.route.snapshot.paramMap.get('id');

    this.userService.getUserById(id).subscribe(res => {
      this.user = res;
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
