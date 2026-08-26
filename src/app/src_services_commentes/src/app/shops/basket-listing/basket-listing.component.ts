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

  constructor(private loadingBar: LoadingBarService, private userService: UserService, public print: PrintService, private dialog: MatDialog, private socket: Socket, private snackBar: SnackBarService) { }

  ngOnInit(): void {
    this.subscription = timer(0, 3000).subscribe(res => {
      this.getUser();
      
    }); 
    // this.socket.on('add_basket_event', () => {
    //   this.getUser();
    // })
  }

  getUser(){
    // this.loadingBar.start();

    // this.userService.getUserById(this.userService.getUserDetails()._id).subscribe(res => {
    //   this.loadingBar.complete();
    //   this.baskets = [];
    //   this.total_price = 0;
    //    res.baskets.filter(resp => {
    //     if(resp.delete == 0 && resp.status == 0){
    //       this.total_price = +this.total_price + (+resp.total_price);
    //       this.baskets.push(resp);
    //     }
    //   });
    // })

    this.userService.getBasket(this.userService.getUserDetails()._id).subscribe(res => {
      this.loadingBar.complete();
      this.total_price = 0;
      this.baskets = res;
       res.filter(resp => {
          this.total_price = +this.total_price + (+resp.total_price);
      });
    })
  }

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

  onPromo(){
    this.snackBar.openSnackBar("Code Promo Incorect!!", "Fermer");
  }

  addCommande(){
    this.dialog.open(AddCommandeComponent, {
      width: '500px',
      data: {
        total_price: this.total_price,
        baskets: this.baskets
      }
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.loadingBar.stop();
  }

}
