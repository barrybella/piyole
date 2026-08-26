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
import { ShopService } from 'src/app/services/shop.service';

// Boîte de dialogue de confirmation par mot de passe avant de supprimer un produit
// (équivalent de ConfirmPasswordComponent, mais pour les produits plutôt que les annonces).
@Component({
  selector: 'app-confirm-password-delete-product',
  templateUrl: './confirm-password-delete-product.component.html',
  styleUrls: ['./confirm-password-delete-product.component.css']
})
export class ConfirmPasswordDeleteProductComponent implements OnInit {
  etatPadding: boolean = false;
  passwordIncorect: boolean = false;
  shop?: any;

  constructor(public dialogRef: MatDialogRef<ConfirmPasswordDeleteProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService, private userService: UserService, private shopService: ShopService, private router: Router, private _snackBar: SnackBarService) { }

  // Récupère le produit concerné, transmis par le composant appelant.
  ngOnInit(): void {
    this.shop = this.data.shop; 
  }

  // Formulaire réactif contenant le seul champ requis : le mot de passe de confirmation.
  controlForm = this.fb.group({
    // motif: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  // confirmation, ferme la boîte de dialogue et redirige vers la liste des produits.
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

        this.shopService.deleteProduct(this.shop._id).subscribe(res => {
          Swal.fire(
            'Annulé!!',
            'Vous avez annuler le produit <span style="color: red;">' + this.shop.productId + '</span> !!',
            'success'
          );
          this.dialogRef.close();
          this.router.navigate(['shops/products-liste']);
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
