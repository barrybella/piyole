import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { PostService } from 'src/app/services/post.service';
import { PrintService } from 'src/app/services/print.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

// Formulaire d'ajout d'un produit au panier : calcule en temps réel le prix total
// (quantité × prix unitaire) à mesure que l'utilisateur ajuste la quantité.
@Component({
  selector: 'app-add-basket',
  templateUrl: './add-basket.component.html',
  styleUrls: ['./add-basket.component.css']
})
export class AddBasketComponent implements OnInit {
  user?: User;
  shop?: any;
  quantity_event?: number = 0;
  total_price_event?: number = 0;

  etatPadding: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddBasketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private router: Router, private postService: PostService, private userService: UserService, public print: PrintService, private snackBar: SnackBarService) { }

  // Récupère le produit (boutique) concerné, transmis par le composant appelant.
  ngOnInit() {
    this.shop = this.data.shop;
  }

  // Formulaire réactif : seule la quantité est saisie manuellement, les autres
  // champs (prix, identifiants) étant complétés automatiquement à la soumission.
  controlForm = this.fb.group({
    quantity: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    desc: [''],
    unite: [''],
    unit_price: [''],
    total_price: [''],
    productId: [''],
    shop_id: [''],
  });


  // Construit l'objet complet à partir des informations du produit et de la
  // quantité saisie, l'ajoute au panier, affiche une confirmation, ferme la boîte
  // de dialogue et redirige vers la liste du panier.
  onSubmit(){
    this.etatPadding = true;
    var object = {
      "quantity": this.quantity?.value,
      "title": this.shop?.title,
      "unit_price": this.shop?.prix_global,
      "total_price": this.total_price_event,
      "desc": this.desc.value,
      "unite": this.shop?.unite,
      "productId": this.shop?.productId,
      "shop_id": this.shop?._id,
    }
    
    this.userService.addBasket(object).subscribe(res => {
      this.snackBar.openSnackBar("Produit Ajouter au panier!!!", "Fermer");
      this.dialogRef.close();
      this.router.navigate(['shops/basket-listing']);
    })
  }

  // Méthode résiduelle liée à un ancien formulaire de contact sur une annonce
  // (semble sans lien direct avec l'ajout au panier).
  contactMe(){
    this.postService.setContactPost(this.data.post._id, this.controlForm.value).subscribe(res => {
      this.etatPadding = false;
      this.dialogRef.close();
      Swal.fire(
        'Contact Effectuer!',
        'Vous allez recevoir un message de confirmation, sinon veuillez vérifier votre numéro de téléphone !!',
        'success'
      );
    })
  }

  // Déclenché à chaque changement de quantité : recalcule le prix total en temps réel.
  changeEvent(event: any){
    this.quantity_event = +event.target.value;
    this.total_price_event = this.quantity_event * this.shop?.prix_global;
  }

  get quantity(){
    return this.controlForm.get('quantity');
  }

  get desc(){
    return this.controlForm.get('desc');
  }

  get adress(){
    return this.controlForm.get('adress');
  }
}
