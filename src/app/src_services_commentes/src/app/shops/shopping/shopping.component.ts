import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit, OnDestroy {
  shops?: any[] = [];
  shopings?: any[] = [];
  page?: number = 0;
  page_count?: number = 0;
  count_products?: number = 0;
  chimer: boolean = false;
  // chimer: boolean = true;
  categories: any[] = [];
  isChecked: boolean = false;
  check_is: boolean = false;
  checkboxStatus: number = 0;
  check_cat: any = '';
  uncheck_cat: any = '';
  chimers: any[] = ['', '', '', '','', '', '', ''];
  chimers_mobile: any[] = ['', '', ''];
  chimer_product: boolean = false;

  constructor(private shopService: ShopService, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.getAllProductsByPaginations();
    this.countProducts();
    this.getCategorieGroupAndCountNumber();
  }

  cats: any[] = [];
  
  onCheckboxChange(event: any, valeur: any) {
    this.chimer = true;
    this.page = 0;
    // this.shops = [];
    this.check_is = true;

    if (event.target.checked) {
      
      console.log("La case à cocher est cochée ! La valeur est : " + valeur);
      this.cats.push(valeur);
      
      this.shopService.setCats(this.cats).subscribe(res => {
        this.shops = res;
        this.chimer = false;
      });

      // this.getPostsByCategoryScrolings(this.cats);
    } else {
      this.cats = this.cats.filter(resp => {
        return resp !== valeur;
      })

      this.shopService.setCats(this.cats).subscribe(res => {
        this.shops = res;
        this.chimer = false;
      });

      if(this.cats.length == 0){
        this.getAllProductsByPaginations();
      }
     
      console.log("La case à cocher est décochée ! La valeur est : " + valeur);
    }

    const checkedItems = this.categories.filter(item => item.isChecked);
    
    if (checkedItems.length === 0) {
      this.check_is = false;
      this.checkboxStatus = 0;
      // this.checkboxStatus = 'Aucune case n\'est cochée';
    } else if (checkedItems.length === this.categories.length) {
      this.check_is = true;
      this.checkboxStatus = 1;
      // this.checkboxStatus = 'Toutes les cases sont cochées';
    } else {
      this.check_is = true;
      this.checkboxStatus = 2;
      // this.checkboxStatus = 'Au moins une case est cochée';
    }

    // console.log("STATUS ", this.checkboxStatus);
    
  }

  getAllProductsByPaginations(){
    this.loadingBar.start();
    // this.chimer = true;
    this.chimer_product = true;
    this.shopService.getAllProductsByPaginations({page: this.page}).subscribe(res => {
      this.loadingBar.stop();
    // this.chimer = false;
    this.chimer_product = false;
      res.forEach((e: any) => {
        this.shops.push(e);
      })
    })
  }

  tabs: any[] = [];

  getPostsByCategoryScrolings(categorie: any){
    this.chimer = true;
    this.shopService.getShopsByCategoryScrolings(categorie, {page: this.page}).subscribe((res: any) => {
    this.chimer = false;
    // console.log("RESULTAT ", res);
    
    res.forEach((e: any) => {
      this.tabs.push(e);
      this.shopings.push(e);
    })
    // console.log("SHOPS ", this.shops);
    })
  }

  getCategorieGroupAndCountNumber(){
    this.shopService.getCategorieGroupAndCountNumber().subscribe(res => {
      this.categories = res;
    })
  }

  countProducts(){
    this.shopService.countProducts().subscribe(res => {
      this.count_products = res;
    })
  }

  onScroll() {
    this.page += 1;
    console.log("CHECK BOX STATUS ", this.checkboxStatus);
    console.log("PAGE SCROLLING ", this.page);
    
    // this.page_count = this.page + 1;
    if(this.checkboxStatus == 0){
      this.getAllProductsByPaginations();
    }else{
      this.getPostsByCategoryScrolings(this.check_cat);
    }
    
  }

  ngOnDestroy(): void {
    this.loadingBar.stop();
  }
  
}
