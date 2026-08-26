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

@Component({
  selector: 'app-products-liste',
  templateUrl: './products-liste.component.html',
  styleUrls: ['./products-liste.component.css']
})
export class ProductsListeComponent implements OnInit, OnDestroy {
  p: number = 1;
  shops: any[] = [];

  constructor(private shopService: ShopService, public print: PrintService, private router: Router, private dialog: MatDialog, private socket: Socket, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.loadingBar.start();
    this.socket.on('shopEvent', () => {
      this.getProducts();
    })
    this.getProducts();
  }

  getProducts(){
    this.shopService.getProducts().subscribe(res => {
      this.shops = res;
      this.loadingBar.complete();
    })
  }

  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }

  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  onDetail(id: any){
    this.router.navigate(['shops/result-recherch-by-shop-id', id])
  }

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

  ngOnDestroy(): void {
    this.loadingBar.stop();
  }
}
