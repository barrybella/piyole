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

// Liste des commandes côté vendeur/agence : rafraîchit automatiquement la liste
// toutes les 3 secondes (polling), et permet de prendre en charge/annuler la
// livraison d'une commande, ainsi que de voir le détail des produits commandés.
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  commandes: Contrat[] = [];
  subscription: Subscription;
  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private commandeService: CommandeService, public print: PrintService, private dialog: MatDialog, private loadingBar: LoadingBarService) { }

  // Démarre un minuteur qui recharge la liste des commandes toutes les 3 secondes,
  // dès le chargement initial (délai de 0ms pour le premier appel).
  ngOnInit(): void {
    this.subscription = timer(0, 3000).subscribe(res => {
      this.getMyCommandes();
      
    }); 
  }

  // Récupère la liste des commandes de l'utilisateur/agence connecté.
  getMyCommandes(){
    this.loadingBar.start();
    this.commandeService.getMyCommandes().subscribe(res => {
      this.commandes = res;
      this.loadingBar.complete();
    })
  }

  // Méthode actuellement vide — suppression de commande non implémentée ici.
  onDelete(commande: any){

  }

  // Bascule l'état de prise en charge de la livraison : si déjà prise en charge,
  onClick(commande){
    if(commande.livraison_en_charge){
      this.onNotPriseEnChargeLiv(commande._id)
    }else{
      this.onPriseEnChargeLiv(commande._id);
    }
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

  // Annule la prise en charge de la livraison d'une commande.
  onNotPriseEnChargeLiv(id: any){
    this.commandeService.onNotPriseEnChargeLiv(id).subscribe(res => {

    })
  }

  // Marque une commande comme prise en charge pour la livraison.
  onPriseEnChargeLiv(id: any){
    this.commandeService.onPriseEnChargeLiv(id).subscribe(res => {
      
    })
  }

  // Arrête le minuteur de rafraîchissement automatique lorsque le composant est détruit,
  // pour éviter des appels réseau inutiles une fois la page quittée.
  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.loadingBar.complete();
  }
}
