import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
import { ShopService } from 'src/app/services/shop.service';
import Swal from 'sweetalert2';
import { ConfirmPasswordDeleteProductComponent } from '../confirm-password-delete-product/confirm-password-delete-product.component';
import { Socket } from 'ngx-socket-io';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { WhatPostComponent } from 'src/app/posts/what-post/what-post.component';

// Liste des produits placés dans la corbeille (supprimés logiquement), avec
// pagination locale (p) et possibilité de voir le détail ou de confirmer
// définitivement l'annulation d'un produit.
@Component({
  selector: 'app-get-corbeil-shops',
  templateUrl: './get-corbeil-shops.component.html',
  styleUrls: ['./get-corbeil-shops.component.css']
})
export class GetCorbeilShopsComponent implements OnInit {
  p: number = 1;
  shops: any[] = [];

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private shopService: ShopService, public print: PrintService, private router: Router, private dialog: MatDialog, private socket: Socket, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.loadingBar.start();
   
    this.getCorbeilShops();
  }

  // Récupère la liste des produits dans la corbeille.
  getCorbeilShops(){
    this.shopService.getCorbeilShops().subscribe(res => {
      this.shops = res;
      this.loadingBar.complete();
    })
  }

  // Ouvre la boîte de dialogue d'aide "Qu'est-ce qu'une annonce ?".
  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }

  // Navigue vers la route donnée.
  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  // Navigue vers la page de résultats de recherche pour cette boutique.
  onDetail(id: any){
    this.router.navigate(['shops/result-recherch-by-shop-id', id])
  }

  // Demande une confirmation avant d'ouvrir la boîte de dialogue de suppression
  // définitive (avec mot de passe) d'un produit de la corbeille.
  onCancel(shop: any){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête enttrain de d\'annuler cet post!!!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, annulez-le !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialog.open(ConfirmPasswordDeleteProductComponent, {
          data: {shop: shop},
          width: '400px'
        })
      }
    })
  }

  // Méthode ngOnDestroy : gère la logique métier associée à cette opération.
  ngOnDestroy(): void {
    this.loadingBar.stop();
  }
}
