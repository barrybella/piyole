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
import { ContactComponent } from '../contact/contact.component';
import { faPlateWheat, faTarp, faPersonDigging, faSquareParking, faCouch, faAirFreshener, faDungeon, faPersonRifle, faBuilding, faCalendar, faFaucetDrip, faShop, faDiamond, faFile } from '@fortawesome/free-solid-svg-icons';
import { ShopService } from 'src/app/services/shop.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.css']
})
export class DetailPostComponent implements OnInit {
  post: Post;
  posts: Post[] = [];
  quartiers: any[] = [];
  post_rents: Post[] = [];
  post_sales: Post[] = [];
  post_authers: Post[] = [];
  post_recent_rents: Post[] = [];
  post_recents: Post[] = [];
  postings?: Post[] = [];

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
  shopings?: Post[] = [];
  chimer: boolean = true;
  chimer_recent: boolean = false;

  chimers_mobile: any[] = ['', '', ''];
  chimers: any[] = ['', '', '', '','', ''];

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private titleService: Title, private shopService: ShopService, private postService: PostService, private router: ActivatedRoute, private fb: FormBuilder, private _snackBar: MatSnackBar, public print: PrintService, private route: Router, private dialog: MatDialog, private el: ElementRef) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit() {
    this.getPost();
    this.getProductByCategoryScrolings();
    // this.formatText();
  }

  /**
   * Récupère les produits ou annonces d'une catégorie avec prise en charge du défilement.
   */
  getProductByCategoryScrolings(){
    this.shopService.getShopForPost().subscribe((res: any) => {
      this.shopings = res;
    })
  }

  /**
   * Formate le texte afin de l'afficher correctement dans l'interface.
   */
  formatText(text: string): string {
    return text.replace(/###\s*(.*?)(\n|$)/g, '<h4 style="font-size: 20px; ">$1</h4><br>').replace(/%%%\s*(.*?)(\n|$)/g, '<h5 style="font-size: 20px; ">$1</h5><br>').replace(/&&&\s*(.*?)(\n|$)/g, '<i style="font-size: 20px; ">$1</i><br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  formControl = this.fb.group({
    tel: ['', [Validators.required]],
    message: ['']
  })
  /**
   * Détermine la couleur à appliquer selon la valeur ou l'état reçu.
   */
  getColor(value: any){
    if(value == 0){
      return '';
    }else if(value == 1){
      return '#FF0100';
    }else if(value == 2){
      return '#0C7420';
    }
  }

  /**
   * Récupère les données de l'annonce à partir de son identifiant ou du contexte courant.
   */
  getPost(){
    const id$ = this.router.paramMap.pipe(
      map((params: ParamMap) => params.get('id'))
    );
    
    id$.subscribe(result => {
      this.postService.getPostDetailOnly(result).subscribe(res => {
        this.chimer = false;
        this.post = res;
        this.dialog.closeAll();
        this.getPosts();
        this.getQuartier();
        this.titleService.setTitle(this.post.title || 'PIYOLE GROUP SARLU');

        if(this.post?.type == 0 || this.post?.type == 1){
          this.getPostByCategorie();
          this.getPostsRecent();
          // this.getPostsByCategoryForSale();
          // this.getPostsForSaleRecent();
        }else if(this.post?.type == 2){
          this.getPostsByCategoryForPlan();
          this.getPostsRecent();
        }
      })
    })
  }

  /**
   * Récupère la liste des annonces correspondant aux critères courants.
   */
  getPosts(){
    this.postService.getPostsByCommuneQuartierCategorieRentOrSale(this.post?.categorie, this.post?.commune, this.post?.quartier, this.post?.type).subscribe((res: any) => {
      this.posts = res;
    })
  }

  /**
   * Exécute le traitement associé à la méthode « getQuartier ».
   */
  getQuartier(){
    this.postService.getQuartierByGroup(this.post?.categorie, this.post?.commune, this.post?.quartier).subscribe(res => { 
      this.quartiers = res;
    }); 
  }
  
  /**
   * Récupère les annonces récentes associées au contexte courant.
   */
  getPostsRecent(){
    this.chimer_recent = true;
    this.postService.getPostsRecent({page_recent: this.page_recent}).subscribe((res: any) => {
      this.chimer_recent = false;
      res.forEach((e: any) => {
        this.post_recents.push(e);
      })
    })
  }

  /**
   * Récupère les plans récemment publiés.
   */
  getPostsForPlanRecent(){
    this.postService.getPostsForPlan().subscribe((res: any) => {
      this.post_recents = res;
    })
  }

  /**
   * Récupère les annonces correspondant à une catégorie.
   */
  getPostByCategorie(){
    this.postService.getPostsByCategoryScrolings(this.post?.categorie, {page: this.page}).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.postings.push(e);
      })
    })
  }

  /**
   * Récupère les annonces d'une catégorie destinées à la vente.
   */
  getPostsByCategoryForSale(){
    this.postService.getPostsByCategoryForSale(this.post?.categorie).subscribe(res => {
      this.post_authers = res;
    })
  }

  /**
   * Récupère les plans associés à une catégorie.
   */
  getPostsByCategoryForPlan(){
    this.postService.getPostsByCategoryPlanScrolings(this.post?.categorie, {page: this.page}).subscribe(res => {
      res.forEach((e: any) => {
        this.postings.push(e);
      })
    })
  }

 
  /**
   * Déclenche l'action permettant de contacter le propriétaire ou l'annonceur.
   */
  onContactMe(post: any){
    this.dialog.open(ContactComponent, {
      data: {post: post},
      width: '500px'
    })
  }

  /**
   * Affiche davantage d'informations ou de résultats.
   */
  onVoirPlus(text: any){
    this.dialog.open(VoirPlusComponent, {
      data: {text: text},
      minWidth: '400px'
    })
  }

  /**
   * Détermine le nombre de chambres ou de pièces à afficher.
   */
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

  /**
   * Détermine les informations relatives à la terrasse ou au balcon.
   */
  getTerrasseOrBalcon(etage){
    if(etage){
      return 'Balcon';
    }else{
      return "Terrasse";
    }
  }

  /**
   * Affiche les informations détaillées de l'élément sélectionné.
   */
  onDetaille(id){
    this.route.navigate(['/posts/detail-post', id])
  }

  get tel(){
    return this.formControl.get('tel');
  }

  /**
   * Gère le défilement et charge les données supplémentaires lorsque nécessaire.
   */
  onScroll() {
    this.page += 1;
    this.getPostByCategorie();
    this.getPostsByCategoryForPlan();
  }

  /**
   * Exécute le traitement associé à la méthode « onScrollRecent ».
   */
  onScrollRecent() {
    this.page_recent += 1;
    this.getPostsRecent();
  }
}
