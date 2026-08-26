import { Component, OnInit, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { PrintService } from 'src/app/services/print.service';
import { VoirPlusComponent } from 'src/app/voir-plus/voir-plus.component';
import { faPlateWheat, faTarp, faPersonDigging, faSquareParking, faCouch, faAirFreshener, faDungeon, faPersonRifle, faBuilding, faCalendar, faFaucetDrip, faShop, faDiamond, faFile } from '@fortawesome/free-solid-svg-icons';
import { ContactComponent } from 'src/app/posts/contact/contact.component';
import { ShopService } from 'src/app/services/shop.service';
import { AddBasketComponent } from '../add-basket/add-basket.component';
import { UserService } from 'src/app/services/user.service';
import { LoginShopComponent } from 'src/app/users/login-shop/login-shop.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css']
})
export class DetailProductComponent implements OnInit {
  shop: any;
  posts: Post[] = [];
  quartiers: any[] = [];
  post_rents: Post[] = [];
  post_sales: Post[] = [];
  post_authers: Post[] = [];
  post_recent_rents: Post[] = [];
  shop_recents: Post[] = [];
  shopings?: Post[] = [];

  faPlateWheat = faPlateWheat;
  faPersonDigging = faPersonDigging;
  faTarp = faTarp;
  faCouch = faCouch;
  faSquareParking = faSquareParking;
  faAirFreshener = faAirFreshener;
  faDungeon = faDungeon;
  faPersonRifle = faPersonRifle;
  faBuilding = faBuilding;
  faCalendar = faCalendar;
  faFaucetDrip = faFaucetDrip;
  faShop = faShop;
  faDiamond = faDiamond;
  faFile = faFile;
  page?: number = 0;
  page_recent?: number = 0;

  chimer: boolean = true;

  tabs: any[] = [];

  constructor(private titleService: Title, private shopService: ShopService, private router: ActivatedRoute, private fb: FormBuilder, private _snackBar: MatSnackBar, public print: PrintService, private route: Router, private dialog: MatDialog, private el: ElementRef, private userService: UserService) { }

  ngOnInit() {
    this.getShop();
    // this.formatText();
  }

  // formatText(text: string): string {
  //   return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  // }

  formatText(text: string): string {
    return text.replace(/###\s*(.*?)(\n|$)/g, '<h4 style="font-size: 20px; ">$1</h4><br>').replace(/%%%\s*(.*?)(\n|$)/g, '<h5 style="font-size: 20px; ">$1</h5><br>').replace(/&&&\s*(.*?)(\n|$)/g, '<i style="font-size: 20px; ">$1</i><br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  formControl = this.fb.group({
    tel: ['', [Validators.required]],
    message: ['']
  })

  // onSubmit(){
  //   const id$ = this.router.paramMap.pipe(
  //     map((params: ParamMap) => params.get('id'))
  //   );
  //   id$.subscribe(response => {
  //     this.postService.testIfContactForPostByIdAndTel(response, this.tel.value).subscribe(result => {
  //       // this.postService.setContactPost(response, this.formControl.value).subscribe(res => {
  //       //   this._snackBar.open("Contact Efectuer", "Quitter");
  //       // })

  //       console.log('RESULT ', result);
        
  //     })
  //   })
  // }

  // imgs_firsts: any[] = [];
  // imgs_sconds: any[] = [];

  getDetais(){
    this.shop?.details.forEach(elem => {
      if(elem.delete == 0){
        this.tabs.push(elem);
      }
    })
  }

  getShop(){
    const id$ = this.router.paramMap.pipe(
      map((params: ParamMap) => params.get('id'))
    );
    
    id$.subscribe(result => {
      this.shopService.getShopDetailOnly(result).subscribe(res => {
        this.chimer = false;
        this.shop = res;
        this.titleService.setTitle(this.shop?.title || 'PIYOLE GROUP SARLU');
        this.dialog.closeAll();
        this.getDetais()
        // this.getProductByCategoryScrolings();
        // this.getShopRecents();
        this.getRec();
        
      })
    })
  }

  getShopRecents(){
    this.shopService.getShopRecents({page_recent: this.page_recent}).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.shop_recents.push(e);
      })
    })
  }
  
  getProductByCategoryScrolings(){
    this.shopService.getProductByCategoryScrolings(this.shop?.categorie, {page: this.page}).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.shopings.push(e);
      })
    })
  }

  getRec(){
    this.shopService.getRec().subscribe((res: any) => {
      this.shopings = res;
    })
  }


  getPostsForPlanRecent(){
    // this.postService.getPostsForPlan().subscribe((res: any) => {
    //   this.post_recents = res;
    // })
  }

  getPostByCategorie(){
    // this.postService.getPostsByCategoryScrolings(this.post?.categorie, {page: this.page}).subscribe((res: any) => {
    //   res.forEach((e: any) => {
    //     this.postings.push(e);
    //   })
    // })
  }

  getPostsByCategoryForSale(){
    // this.postService.getPostsByCategoryForSale(this.post?.categorie).subscribe(res => {
    //   this.post_authers = res;
    // })
  }

  getPostsByCategoryForPlan(){
    // this.postService.getPostsByCategoryPlanScrolings(this.post?.categorie, {page: this.page}).subscribe(res => {
    //   res.forEach((e: any) => {
    //     this.postings.push(e);
    //   })
    // })
  }

 
  addBasket(shop: any){
    if(this.userService.isLoggedIn()){
      this.dialog.open(AddBasketComponent, {
        data: {shop: shop},
        width: '500px'
      })
    }else{
      this.dialog.open(LoginShopComponent, {
        data: {shop: shop},
        width: '500px'
      })
    }
  }

  onVoirPlus(text: any){
    this.dialog.open(VoirPlusComponent, {
      data: {text: text},
      minWidth: '400px'
    })
  }

  getChambreOrPiece(value){
    if(value == 'Usage Multiple'){
      return 'Pieces';
    }else if(value == 'École/Universitée'){
      return "Classes";
    }else if(value == 'Magasin/Stock'){
      return "Pieces";
    }else if(value == 'Bureaux' || value == 'Autres'){
      return "Pieces";
    }else{
      return "Chambres";
    }
  }

  getTerrasseOrBalcon(etage){
    if(etage){
      return 'Balcon';
    }else{
      return "Terrasse";
    }
  }

  onDetaille(id){
    this.route.navigate(['/shops/detail-product', id])
  }

  get tel(){
    return this.formControl.get('tel');
  }

  onScroll() {
    this.page_recent += 1;
    this.getShopRecents();
  }

  onScrollCategorie() {
    this.page += 1;
    this.getProductByCategoryScrolings();
  }


}
