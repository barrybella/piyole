import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Router } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { ContratService } from 'src/app/services/contrat.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

// Boîte de dialogue de confirmation par mot de passe, utilisée avant une action
// sensible et irréversible (ici : supprimer/annuler une annonce). Demande à
// l'utilisateur de ressaisir son mot de passe avant d'exécuter l'action.
@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.css']
})
export class ConfirmPasswordComponent implements OnInit {
  etatPadding: boolean = false;
  passwordIncorect: boolean = false;
  post?: Post;

  constructor(public dialogRef: MatDialogRef<ConfirmPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService, private userService: UserService, private postService: PostService, private router: Router, private _snackBar: SnackBarService) { }

  // Récupère l'annonce concernée, transmise par le composant appelant via les
  // données de la boîte de dialogue.
  ngOnInit(): void {
    this.post = this.data.post; 
  }

  // Formulaire réactif contenant le seul champ requis : le mot de passe de confirmation.
  controlForm = this.fb.group({
    password: ['', [Validators.required]],
  });

  // erreur. Si correct, supprime l'annonce concernée, affiche une confirmation
  // visuelle (SweetAlert2), ferme la boîte de dialogue et redirige vers le tableau
  // de bord des annonces.
  onSubmit(){
    this.etatPadding = true;
    let tel: string;
    tel = this.userService.getUserDetails().tel;
    var object = {
      login: tel,
      password: this.password?.value
    };

    this.userService.confirmPasswordLogin(object).subscribe(res => {
      if(!res){
        this.passwordIncorect = true;
        this.etatPadding = false;
      }else{ 
        this._snackBar.openSnackBar("Annulation en cours...", '');

        this.postService.deletePost(this.post._id).subscribe(res => {
          Swal.fire(
            'Annulé!!',
            'Vous avez annuler le post <span style="color: red;">' + this.post.postId + '</span> !!',
            'success'
          );
          this.dialogRef.close();
          this.router.navigate(['posts/dashboard']);
        })
      }
    });
  }

  get motif() {
    return this.controlForm.get('motif');
  }

  get password() {
    return this.controlForm.get('password');
  }
}
