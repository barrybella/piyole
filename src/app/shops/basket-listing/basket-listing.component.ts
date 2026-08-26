import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Socket } from 'ngx-socket-io';
import { User } from 'src/app/interfaces/user';
import { PrintService } from 'src/app/services/print.service';
import { UserService } from 'src/app/services/user.service';
import { DeleteBasketComponent } from '../delete-basket/delete-basket.component';
import Swal from 'sweetalert2';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { AddCommandeComponent } from 'src/app/commandes/add-commande/add-commande.component';
import { Subscription, timer } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';

// Page du panier d'achat : rafraîchit automatiquement le contenu toutes les 3
// le prix total, et permet de retirer un article ou de finaliser la commande.
@Component({
  selector: 'app-basket-listing',
  templateUrl: './basket-listing.component.html',
  styleUrls: ['./basket-listing.component.css']
})
export class BasketListingComponent implements OnInit, OnDestroy {
  user?: User;
  baskets?: any[] = [];
  total_price?: number = 0;
  subscription: Subscription;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private loadingBar: LoadingBarService, private userService: UserService, public print: PrintService, private dialog: MatDialog, private socket: Socket, private snackBar: SnackBarService) { }

  // Démarre un minuteur qui recharge le panier toutes les 3 secondes.
  ngOnInit(): void {
    this.subscription = timer(0, 3000).subscribe(res => {
      this.getUser();
      
    }); 
  }

  // Récupère le contenu du panier de l'utilisateur connecté et calcule le prix
  // total en additionnant le prix de chaque article. Le bloc commenté ci-dessus
  // était une ancienne approche filtrant les articles depuis le profil utilisateur
  // complet, remplacée par un appel dédié (getBasket).
  getUser(){


    this.userService.getBasket(this.userService.getUserDetails()._id).subscribe(res => {
      this.loadingBar.complete();
      this.total_price = 0;
      this.baskets = res;
       res.filter(resp => {
          this.total_price = +this.total_price + (+resp.total_price);
      });
    })
  }

  // Demande une confirmation avant de retirer un article du panier.
  onDelete(basket: any){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête entrain d'annuler cet produit au panier!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, j\'annule !',
      cancelButtonText: 'Non'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.userService.deleteBasket(basket._id).subscribe(resp => {
          this.snackBar.openSnackBar("Produit supprimer avec sucès!!", "Fermer");
        })
      }
    });
  }

  // Affiche un message d'erreur générique pour tout code promo saisi (fonctionnalité
  // de codes promo non réellement implémentée).
  onPromo(){
    this.snackBar.openSnackBar("Code Promo Incorect!!", "Fermer");
  }

  // Ouvre la boîte de dialogue de finalisation de commande, avec le prix total
  // et le contenu du panier.
  addCommande(){
    this.dialog.open(AddCommandeComponent, {
      width: '500px',
      data: {
        total_price: this.total_price,
        baskets: this.baskets
      }
    })
  }

  // Méthode ngOnDestroy : gère la logique métier associée à cette opération.
  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.loadingBar.stop();
  }

}
