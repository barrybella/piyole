import { LoadingBarService } from '@ngx-loading-bar/core';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';
import { CommandeService } from 'src/app/services/commande.service';
import { ProductListeCommandeComponent } from '../product-liste-commande/product-liste-commande.component';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  commandes: Contrat[] = [];
  subscription: Subscription;
  constructor(private commandeService: CommandeService, public print: PrintService, private dialog: MatDialog, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.subscription = timer(0, 3000).subscribe(res => {
      this.getMyCommandes();
      
    }); 
  }

  getMyCommandes(){
    this.loadingBar.start();
    this.commandeService.getMyCommandes().subscribe(res => {
      this.commandes = res;
      this.loadingBar.complete();
    })
  }

  onDelete(commande: any){

  }

  onClick(commande){
    if(commande.livraison_en_charge){
      this.onNotPriseEnChargeLiv(commande._id)
    }else{
      this.onPriseEnChargeLiv(commande._id);
    }
  }


  onProducts(commande: any){
    this.dialog.open(ProductListeCommandeComponent, {
      width: '700px',
      data: {
        products: commande.products
      }
    })
  }

  onNotPriseEnChargeLiv(id: any){
    this.commandeService.onNotPriseEnChargeLiv(id).subscribe(res => {

    })
  }

  onPriseEnChargeLiv(id: any){
    this.commandeService.onPriseEnChargeLiv(id).subscribe(res => {
      
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.loadingBar.complete();
  }
}
