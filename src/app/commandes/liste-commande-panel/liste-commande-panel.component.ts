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

// order-list.component.ts mais pour le point de vue du client, avec en plus les
// actions de gestion de l'état de livraison et de paiement.
@Component({
  selector: 'app-liste-commande-panel',
  templateUrl: './liste-commande-panel.component.html',
  styleUrls: ['./liste-commande-panel.component.css']
})
export class ListeCommandePanelComponent implements OnInit, OnDestroy {
  commandes: Contrat[] = [];
  subscription: Subscription;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private commandeService: CommandeService, public print: PrintService, private dialog: MatDialog, private loadingBar: LoadingBarService, private socket: Socket) { }

  // Démarre un minuteur qui recharge la liste des commandes du client toutes les
  // 3 secondes. L'abonnement WebSocket équivalent est commenté (probablement
  // remplacé par ce polling, ou en cours de test).
  ngOnInit(): void {

    this.subscription = timer(0, 3000).subscribe(res => {
      this.getMyCommandesClientPanel();
      
    }); 
  }

  // Récupère la liste des commandes du client connecté.
  getMyCommandesClientPanel(){
    this.loadingBar.start();
    this.commandeService.getMyCommandesClientPanel().subscribe(res => {
      this.commandes = res;
      this.loadingBar.complete();
    })
  }

  // Méthode actuellement vide — suppression de commande non implémentée ici.
  onDelete(commande: any){

  }

  // Bascule l'état de prise en charge de la livraison.
  onClick(commande){
    if(commande.livraison_en_charge){
      this.onNotPriseEnChargeLiv(commande._id)
    }else{
      this.onPriseEnChargeLiv(commande._id);
    }
  }

  // Marque une commande comme prise en charge pour la livraison.
  onPriseEnChargeLiv(id: any){
    this.commandeService.onPriseEnChargeLiv(id).subscribe(res => {
      
    })
  }

  // Annule la prise en charge de la livraison d'une commande.
  onNotPriseEnChargeLiv(id: any){
    this.commandeService.onNotPriseEnChargeLiv(id).subscribe(res => {

    })
  }

  // Ouvre la boîte de dialogue permettant de modifier l'état de livraison d'une commande.
  onEtatLiv(commande: any){
    this.dialog.open(EtatLivraisonComponent, {
      width: '500px',
      data: {
        commande: commande
      }
    })
  }

  // Ouvre la boîte de dialogue permettant de confirmer le paiement d'une commande.
  onPay(commande: any){
    this.dialog.open(OnPayComponent, {
      width: '500px',
      data: {
        commande: commande
      }
    })
  }

  // Ouvre la boîte de dialogue affichant le détail des produits d'une commande.
  onProducts(commande: any){
    this.dialog.open(ProductListeCommandeComponent, {
      width: '700px',
      data: {
        products: commande.products
      }
    })
  }

  // Arrête le minuteur de rafraîchissement automatique lorsque le composant est détruit.
  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.loadingBar.complete();
  }
}
