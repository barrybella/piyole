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

@Component({
  selector: 'app-result-recherch-by-shop-id',
  templateUrl: './result-recherch-by-shop-id.component.html',
  styleUrls: ['./result-recherch-by-shop-id.component.css']
})
export class ResultRecherchByShopIdComponent implements OnInit, OnDestroy {
  shop: any;
  subscription: Subscription;
  tabs: any[] = [];
  
  constructor(private route: ActivatedRoute, private loadingBar: LoadingBarService, private shopService: ShopService, private dialog: MatDialog, private location: Location, public print: PrintService, private router: Router) { }

  ngOnInit(): void {
    // this.subscription = timer(0, 3000).subscribe(res => {
    // }); 
    this.getShop();
  }

  getShop(){
    const id$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id'))
    );
    
    id$.subscribe(result => {
      this.getPostById(result); 
    })
  }

  getDetais(){
    this.shop?.details.forEach(elem => {
      if(elem.delete == 0){
        this.tabs.push(elem);
      }
    })
  }

  getPostById(_id: any){
    this.loadingBar.start();
    console.log("_ID ", _id);
    var url = 'https://kanabah.herokuapp.com/';
    this.shopService.getShopById(_id).subscribe(result => {
      this.loadingBar.complete();
      this.shop = result;
      console.log("post ", this.shop?.title);
      this.getDetais();
      this.dialog.closeAll();
      // if(this.post?.status == 1 && this.post?.active == 'true'){
      //   Swal.fire({
      //     icon: 'info',
      //     title: 'Dejat Pris...',
      //     text: 'Cet publication a dejat un contrat en cours!!',
      //     footer: '<a class="link" href="'+ url  +'">Voulez vous voir le contrat?</a>'
      //   })
      // }else if(this.post?.active == 'false'){
      //   Swal.fire({
      //     icon: 'info',
      //     title: 'Validation en cours...',
      //     text: 'Cet publication est en cours de validation!!'
      //   });
      // }
    })
  }

  onCancel(shop: any){

  }

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

  addDetails(shop: any){
    this.dialog.open(AddDetailsComponent, {
      width: '400px',
      disableClose: true,
      data: {
        "shop": shop
      }
    })
  }

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

  onRedirect(route: any, id: any){
    this.router.navigate([route, id]);
  }

  onBack(){
    this.location.back();
  }

  // formatText(text: string): string {
  //   return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  // }

  formatText(text: string): string {
    return text.replace(/###\s*(.*?)(\n|$)/g, '<h4 style="font-size: 20px; ">$1</h4><br>').replace(/%%%\s*(.*?)(\n|$)/g, '<h5 style="font-size: 20px; ">$1</h5><br>').replace(/&&&\s*(.*?)(\n|$)/g, '<i style="font-size: 20px; ">$1</i><br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  printDesc(text: any){
    var texteAvecSautsDeLigne = text.replace(/\n/g, "<br>");
    return texteAvecSautsDeLigne;
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
