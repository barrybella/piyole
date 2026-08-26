import { LoadingBarService } from '@ngx-loading-bar/core';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';
import { CommandeService } from 'src/app/services/commande.service';
import { ProductListeCommandeComponent } from '../product-liste-commande/product-liste-commande.component';
import { EtatLivraisonComponent } from '../etat-livraison/etat-livraison.component';
import { Socket } from 'ngx-socket-io';
import { OnPayComponent } from '../on-pay/on-pay.component';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-liste-commande-panel',
  templateUrl: './liste-commande-panel.component.html',
  styleUrls: ['./liste-commande-panel.component.css']
})
export class ListeCommandePanelComponent implements OnInit, OnDestroy {
  commandes: Contrat[] = [];
  subscription: Subscription;

  constructor(private commandeService: CommandeService, public print: PrintService, private dialog: MatDialog, private loadingBar: LoadingBarService, private socket: Socket) { }

  ngOnInit(): void {

    this.subscription = timer(0, 3000).subscribe(res => {
      this.getMyCommandesClientPanel();
      
    }); 
    // this.socket.on('commande_event', () => {
    //   this.getMyCommandesClientPanel();
    //  });
  }

  getMyCommandesClientPanel(){
    this.loadingBar.start();
    this.commandeService.getMyCommandesClientPanel().subscribe(res => {
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

  onPriseEnChargeLiv(id: any){
    this.commandeService.onPriseEnChargeLiv(id).subscribe(res => {
      
    })
  }

  onNotPriseEnChargeLiv(id: any){
    this.commandeService.onNotPriseEnChargeLiv(id).subscribe(res => {

    })
  }

  onEtatLiv(commande: any){
    this.dialog.open(EtatLivraisonComponent, {
      width: '500px',
      data: {
        commande: commande
      }
    })
  }

  onPay(commande: any){
    this.dialog.open(OnPayComponent, {
      width: '500px',
      data: {
        commande: commande
      }
    })
  }

  onProducts(commande: any){
    this.dialog.open(ProductListeCommandeComponent, {
      width: '700px',
      data: {
        products: commande.products
      }
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.loadingBar.complete();
  }
}
