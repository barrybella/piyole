import { PrintService } from 'src/app/services/print.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordComponent } from 'src/app/forget-password/forget-password.component';

// Page de connexion "standard" (agence/client web). Vérifie que l'utilisateur
// connecté possède bien le rôle "user" (client) avant de le laisser accéder au
// tableau de bord — sinon, le déconnecte immédiatement.
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  passwordIncorect: boolean = false;
  etatPadding: boolean = false;
  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, public print: PrintService, private dialog: MatDialog) { }

  ngOnInit() {
  }

  // Formulaire réactif : identifiant (téléphone/email) et mot de passe.
  loginForm = this.fb.group({
    login: ['', {
      validators: [
       Validators.required,
     ]}
   ],
    password: ['', [Validators.required]]
  })

  // Tente la connexion via l'API web. Si les identifiants sont incorrects, affiche
  // une erreur. Si la connexion réussit mais que le rôle de l'utilisateur n'est pas
  // sinon, redirige vers le tableau de bord des annonces.
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
        this.router.navigate(['/posts/dashboard']);
      }
    })
  }

  // Ouvre la boîte de dialogue "mot de passe oublié".
  onClick(){
    this.dialog.open(ForgetPasswordComponent, {
      width: '500px'
    })
  }
}
