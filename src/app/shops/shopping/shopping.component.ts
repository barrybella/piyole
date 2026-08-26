import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ShopService } from 'src/app/services/shop.service';

// avec défilement infini (pagination progressive au scroll) et filtrage par
// catégories via cases à cocher multiples.
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
  categories: any[] = [];
  isChecked: boolean = false;
  check_is: boolean = false;
  checkboxStatus: number = 0;
  check_cat: any = '';
  uncheck_cat: any = '';
  chimers: any[] = ['', '', '', '','', '', '', ''];
  chimers_mobile: any[] = ['', '', ''];
  chimer_product: boolean = false;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private shopService: ShopService, private loadingBar: LoadingBarService) { }

  // Charge le premier lot de produits, le nombre total de produits, et les
  // catégories disponibles (avec leur nombre d'articles) pour les filtres.
  ngOnInit(): void {
    this.getAllProductsByPaginations();
    this.countProducts();
    this.getCategorieGroupAndCountNumber();
  }

  cats: any[] = [];
  
  // Déclenché à chaque coche/décoche d'une catégorie de filtre : met à jour la
  // liste des catégories sélectionnées (cats) et recharge les produits filtrés
  // en conséquence. Si plus aucune catégorie n'est cochée, revient à la liste
  // complète paginée. Calcule aussi un statut global (0=aucune, 1=toutes,
  // 2=partielle) utilisé notamment par le défilement infini.
  onCheckboxChange(event: any, valeur: any) {
    this.chimer = true;
    this.page = 0;
    this.check_is = true;

    if (event.target.checked) {
      
      this.cats.push(valeur);
      
      this.shopService.setCats(this.cats).subscribe(res => {
        this.shops = res;
        this.chimer = false;
      });

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
     
    }

    const checkedItems = this.categories.filter(item => item.isChecked);
    
    if (checkedItems.length === 0) {
      this.check_is = false;
      this.checkboxStatus = 0;
    } else if (checkedItems.length === this.categories.length) {
      this.check_is = true;
      this.checkboxStatus = 1;
    } else {
      this.check_is = true;
      this.checkboxStatus = 2;
    }

    
  }

  // Récupère un lot supplémentaire de produits (page courante) et l'ajoute à la
  // liste existante — pattern classique de défilement infini.
  getAllProductsByPaginations(){
    this.loadingBar.start();
    this.chimer_product = true;
    this.shopService.getAllProductsByPaginations({page: this.page}).subscribe(res => {
      this.loadingBar.stop();
    this.chimer_product = false;
      res.forEach((e: any) => {
        this.shops.push(e);
      })
    })
  }

  tabs: any[] = [];

  // Récupère un lot supplémentaire de produits pour une catégorie donnée, avec
  // défilement infini.
  getPostsByCategoryScrolings(categorie: any){
    this.chimer = true;
    this.shopService.getShopsByCategoryScrolings(categorie, {page: this.page}).subscribe((res: any) => {
    this.chimer = false;
    
    res.forEach((e: any) => {
      this.tabs.push(e);
      this.shopings.push(e);
    })
    })
  }

  // Récupère les catégories disponibles avec leur nombre d'articles.
  getCategorieGroupAndCountNumber(){
    this.shopService.getCategorieGroupAndCountNumber().subscribe(res => {
      this.categories = res;
    })
  }

  // Récupère le nombre total de produits.
  countProducts(){
    this.shopService.countProducts().subscribe(res => {
      this.count_products = res;
    })
  }

  // incrémente le numéro de page, puis charge le lot suivant, soit tous produits
  // confondus, soit filtré par catégorie selon l'état des cases à cocher.
  onScroll() {
    this.page += 1;
    
    if(this.checkboxStatus == 0){
      this.getAllProductsByPaginations();
    }else{
      this.getPostsByCategoryScrolings(this.check_cat);
    }
    
  }

  // Méthode ngOnDestroy : gère la logique métier associée à cette opération.
  ngOnDestroy(): void {
    this.loadingBar.stop();
  }
  
}
