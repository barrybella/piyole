import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { map } from 'rxjs';
import { PrintService } from 'src/app/services/print.service';
import { ShopService } from 'src/app/services/shop.service';
import { AddDetailsComponent } from '../add-details/add-details.component';
import { Subscription, timer } from 'rxjs';
import { UpdateDetailsComponent } from '../update-details/update-details.component';
import Swal from 'sweetalert2';

// Page de détail d'une boutique côté agence/vendeur : affiche la boutique complète
// avec ses détails (variantes/caractéristiques non supprimés), et permet la gestion
// complète (ajout/modification/suppression de détails, suppression du produit).
@Component({
  selector: 'app-result-recherch-by-shop-id',
  templateUrl: './result-recherch-by-shop-id.component.html',
  styleUrls: ['./result-recherch-by-shop-id.component.css']
})
export class ResultRecherchByShopIdComponent implements OnInit, OnDestroy {
  shop: any;
  subscription: Subscription;
  tabs: any[] = [];
  
  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private route: ActivatedRoute, private loadingBar: LoadingBarService, private shopService: ShopService, private dialog: MatDialog, private location: Location, public print: PrintService, private router: Router) { }

  ngOnInit(): void {
    this.getShop();
  }

  // Récupère l'identifiant de la boutique depuis l'URL, puis charge ses données.
  getShop(){
    const id$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id'))
    );
    
    id$.subscribe(result => {
      this.getPostById(result); 
    })
  }

  // Filtre les détails de la boutique pour ne garder que ceux non supprimés.
  getDetais(){
    this.shop?.details.forEach(elem => {
      if(elem.delete == 0){
        this.tabs.push(elem);
      }
    })
  }

  // Récupère la boutique complète via son identifiant, puis charge ses détails
  // et ferme toute boîte de dialogue restée ouverte. La logique d'avertissement
  // sur le statut de la publication est commentée/désactivée.
  getPostById(_id: any){
    this.loadingBar.start();
    var url = 'https://kanabah.herokuapp.com/';
    this.shopService.getShopById(_id).subscribe(result => {
      this.loadingBar.complete();
      this.shop = result;
      this.getDetais();
      this.dialog.closeAll();
      //     icon: 'info',
      //     title: 'Dejat Pris...',
      //     text: 'Cet publication a dejat un contrat en cours!!',
      //     footer: '<a class="link" href="'+ url  +'">Voulez vous voir le contrat?</a>'
      //     icon: 'info',
      //     title: 'Validation en cours...',
      //     text: 'Cet publication est en cours de validation!!'
    })
  }

  // Méthode actuellement vide.
  onCancel(shop: any){

  }

  // Demande une confirmation avant de supprimer complètement le produit.
  onDeleteShop(shop: any){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête entrain de supprimer cet produit!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le !',
      cancelButtonText: 'Annuler'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.shopService.deleteProduct(shop._id).subscribe(resp => {
          Swal.fire("Supprimé!!", "Produit supprimer avec succès!!", "success")
        })
      } 
    });
  }

  // Ouvre la boîte de dialogue d'ajout d'un détail à la boutique.
  addDetails(shop: any){
    this.dialog.open(AddDetailsComponent, {
      width: '400px',
      disableClose: true,
      data: {
        "shop": shop
      }
    })
  }

  // Ouvre la boîte de dialogue de modification d'un détail existant.
  onUpdate(detail: any, id: any){
    this.dialog.open(UpdateDetailsComponent, {
      width: '400px',
      disableClose: true,
      data: {
        "detail": detail,
        "id": id
        
      }
    })
  }

  // Demande une confirmation avant de supprimer un détail de la boutique.
  onDelete(detail: any, id: any){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête entrain de supprimer cet detail!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le !',
      cancelButtonText: 'Annuler'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.shopService.deleteDetails(id, detail._id).subscribe(resp => {
          Swal.fire("Supprimé!!", "Cet detail a été supprimer avec succès!!", "success");
        })
      } 
    });
  }

  // Navigue vers une route donnée avec un paramètre.
  onRedirect(route: any, id: any){
    this.router.navigate([route, id]);
  }

  // Retourne à la page précédente dans l'historique de navigation.
  onBack(){
    this.location.back();
  }


  // Convertit une syntaxe de mise en forme personnalisée (###, %%%, &&&, **gras**)
  // en HTML pour l'affichage de la description enrichie.
  formatText(text: string): string {
    return text.replace(/###\s*(.*?)(\n|$)/g, '<h4 style="font-size: 20px; ">$1</h4><br>').replace(/%%%\s*(.*?)(\n|$)/g, '<h5 style="font-size: 20px; ">$1</h5><br>').replace(/&&&\s*(.*?)(\n|$)/g, '<i style="font-size: 20px; ">$1</i><br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  // Convertit les sauts de ligne d'un texte en balises <br> HTML.
  printDesc(text: any){
    var texteAvecSautsDeLigne = text.replace(/\n/g, "<br>");
    return texteAvecSautsDeLigne;
  }

  // Méthode ngOnDestroy : gère la logique métier associée à cette opération.
  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
