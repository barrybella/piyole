import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { publicUrl } from '../backend';
import { Post } from '../interfaces/post';
import { PostService } from '../services/post.service';
import { PrintService } from '../services/print.service';
import { Socket } from 'ngx-socket-io';
import { JsService } from '../services/js.service';
import { ToolsService } from '../services/tools.service';
import * as $ from 'jquery';
import { Subscription, timer } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
// <i class="fa-solid fa-person-digging"></i>
import Swal from 'sweetalert2';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  posts: Post[] = [];
  postSales: Post[] = [];
  shops: any[] = [];
  plans: Post[] = [];
  communes: any[] = [];
  quartiers: any[] = [];
  categories: any[] = [];
  regions_counts: any[] = [];

  red_commune: boolean = false;
  etatPadding: boolean = false;
  count_post_vente_and_location?: number = 0;
  count_post_plans?: number = 0;
  count_cate?: number = 0;

  count_agence?: number = 0;
  count_posts?: number = 0;
  count_quartiers?: number = 0;
  count_clients?: number = 0;

  faStore = faStore;
  chimer: boolean = false;
  chimer_plans: boolean = false;
  chimer_product: boolean = false;

  // faPersonDigging = faPersonDigging;
  // faTarp = faTarp;
  // faDungeon = faDungeon;
  
  constructor(private postService: PostService, @Inject(DOCUMENT) private document: Document, private shopService: ShopService, public print: PrintService, private socket: Socket, private js: JsService, private toolsService: ToolsService, private fb: FormBuilder, private router: Router, public userService: UserService, private loadingBar: LoadingBarService) { }
  ngOnInit() {
    this.js.jsHome();
    this.getCountCategorie();
    this.countPostVenteAndLocation();
    this.countPostPlans();
    
    this.getCommunes();
    
    // this.getPostsForRent();
    // this.getPostsForSale();
    this.getPostsForPlanHomes();
    this.getPostsHomes();
    this.socket.on('postList', () => {
      // this.getPostsForRent();
      // this.getPostsForSale();
      this.getPostsForPlanHomes();
      this.getPostsHomes();
    })
    // this.methodJquery();
    this.getShopHome();
    this.getCount();
    this.countQuartiers();
  }

  getCount(){
    this.userService.countUserClientOnly().subscribe(res => {
      this.count_clients = res;
    });

    this.userService.countAgences().subscribe(res => {
      this.count_agence = res;
    });

    this.postService.countAllPost().subscribe(res => {
      this.count_posts = res;
    });

    this.postService.countPostByRegion().subscribe(res => {
      this.regions_counts = res;
    });
  }

  getPostsHomes(){
    this.chimer = true;
    this.loadingBar.start();
    this.postService.getPostsHomes().subscribe(res => {
      this.chimer = false;
      this.posts = res;
      this.loadingBar.complete();
    })
  }

  getCountCate(cate: any){
   var count = 0;
    if(this.categories.length > 0){
      this.categories.forEach(resp => {
        if(cate == resp._id){
          count = resp.count
        }
      })
    }

    return count;
  }

  getCountRegion(region: any){
   var count = 0;
    if(this.regions_counts.length > 0){
      this.regions_counts.forEach(resp => {
        if(region == resp._id){
          count = resp.count
        }
      })
    }

    return count;
  }

  countPostVenteAndLocation(){
    this.postService.countPostVenteAndLocation().subscribe(res => {
      this.count_post_vente_and_location = res;
    })
  }

  countPostPlans(){
    this.postService.countPostPlans().subscribe(res => {
      this.count_post_plans = res;
    })
  }

  getShopHome(){
    this.chimer_product = true;
    this.shopService.getShopHome().subscribe(res => {
      this.chimer_product = false;
      this.shops = res;
    })
  }

  getPostsForRent(){
    this.postService.getPostsForRent(20).subscribe(res => {
      this.posts = res;
    })
  }

  getPostsForPlanHomes(){
    this.chimer_plans = true;
    this.postService.getPostsForPlanHomes().subscribe(res => {
      this.chimer_plans = false
      this.plans = res;
    })
  }

  getPostsForSale(){
    this.postService.getPostsForSale(15).subscribe(res => {
      this.postSales = res;
    })
  }

  getCommunes(){
    this.toolsService.getCommunes().subscribe(res => {
      this.communes = res;
    })
  }

  countQuartiers(){
    this.toolsService.countQuartiers().subscribe(res => {
      this.count_quartiers = res;
    })
  }

  quartierFileters: any[] = [];
  select_commune: boolean = false;

  // quartier?: any;
  commune_ville?: any;
  tab: any[] = [];

  // methodJquery(){
  //   // this.select_commune = true;
  //   this.quartierFileters = [];

    
  //   this.quartierFileters = this.quartiers.filter(resp => {
  //     console.log("COMMUNE resp ", resp);
      
  //     return resp.commune == $('#opt_ng').attr("value");
  //     // return resp.commune == $('#p').attr("value");
  //   });
  // }
  
  change: boolean = false;
  chargement: boolean = false;

  changeEvent(event?: any){
    this.change = false;
    this.chargement = true;
    var commune =  event.target.value;
    this.quartierFileters = [];

    this.toolsService.getQuartiersByCommune(commune).subscribe(resp => {
      this.quartierFileters = resp;
      this.change = true;
      this.chargement = false;
    })
  }
  
  onRedirect(id: any){
    this.document.location.href = `${publicUrl}/${id}`;
  }

  redirect(route: any, params: any){
    this.router.navigate([route, params]);
  }

  onGetPostByCommune(region: any){
    this.router.navigate(['posts/get-post-by-ville', region]);
  }

  redirectPlan(route: any){
    this.router.navigate([route]);
  }

  getCountCategorie(){
    this.postService.getCountCategorie().subscribe(res => {
      this.categories = res;
    })
  }

  controlForm = this.fb.group({
    commune: ['Commune (ville)', [Validators.required]],
    quartier: ['Quartier (secteur)', [Validators.required]],
    type: ['Location ou Vente', [Validators.required]],
    categorie: ['Categories', [Validators.required]],
    prix_min: ['Prix(Min)', [Validators.required]],
    prix_max: ['Prix(Max)', [Validators.required]], 
  });

  onSubmit(){
    this.etatPadding = true;
    var type_post = 0;
    // this.commune.setValue($('#opt_ng').attr("value"));
    this.quartier.setValue($('#quartier_ng').attr("value"));
    this.type.setValue($('#type_ng').attr("value"));
    this.categorie.setValue($('#categorie_ng').attr("value"));
    this.prix_min.setValue(+$('#prix_min_ng').attr("value"));
    this.prix_max.setValue(+$('#prix_max_ng').attr("value"));

    // console.log("FORM CONTROL ", this.controlForm.value);
    
    if(!this.commune.value || this.commune?.value == 'Commune (ville)'){
      this.red_commune = true;
      this.quartier.setValue('Quartier (secteur)');

      Swal.fire(
        'Imposible!!',
        'Veuillez choisir la commune!!',
        'warning'
      );
      this.etatPadding = false;
      return;
    }

    // if(!this.quartier.value || this.quartier.value == 'Quartier (secteur)'){
    //   this.quartier.setValue('Quartier (secteur)');
    //   Swal.fire(
    //     'Imposible!!',
    //     'Veuillez choisir le quartier!!',
    //     'warning'
    //   );
    //   this.etatPadding = false;
    //   return;
    // }

    // if(!this.type.value || this.type.value == 'Location ou Vente' || this.quartierFileters.length == 0){
    //   Swal.fire(
    //     'Imposible!!',
    //     'Veuillez choisir le type (Location ou Vente)!!',
    //     'warning'
    //   );
    //   this.etatPadding = false;
    //   return;
    // }

    // if(!this.categorie.value || this.categorie.value == 'Categories'){
    //   Swal.fire(
    //     'Imposible!!',
    //     'Veuillez choisir la categorie!!',
    //     'warning'
    //   );
    //   this.etatPadding = false;
    //   return;
    // }

    // if(!this.prix_min.value || this.prix_min.value == 'Prix(Min)'){
    //   Swal.fire(
    //     'Imposible!!',
    //     'Veuillez choisir le prix mimimal!!',
    //     'warning'
    //   );
    //   this.etatPadding = false;
    //   return;
    // }

    // if(!this.prix_max.value || this.prix_max.value == 'Prix(Max)'){
    //   Swal.fire(
    //     'Imposible!!',
    //     'Veuillez choisir le prix maximal!!',
    //     'warning'
    //   );
    //   this.etatPadding = false;
    //   return;
    // }

    // if(this.prix_max.value < this.prix_min.value){
    //   Swal.fire(
    //     'Imposible!!',
    //     'Le prix maximal ne doit pas être inférieur au prix mimimal!!',
    //     'warning'
    //   );
    //   this.etatPadding = false;
    //   return;
    // }

    if(this.type.value == 'Location') {
      type_post = 0;
      this.router.navigate(['posts/get-posts-rent-cherch-result', this.commune.value, this.quartier.value, type_post, this.categorie.value, this.prix_min.value, this.prix_max.value]);
    }else{
      type_post = 1;
      this.router.navigate(['posts/get-posts-rent-cherch-result', this.commune.value, this.quartier.value, type_post, this.categorie.value, this.prix_min.value, this.prix_max.value]);
    }
    
  }

  // getChambreOrPiece(value){
  //   if(value == 'Usage Multiple'){
  //     return 'Pieces';
  //   }else if(value == 'École/Universitée'){
  //     return "Classes";
  //   }else if(value == 'Magasin/Stock'){
  //     return "Pieces";
  //   }else if(value == 'Bureaux'){
  //     return "Pieces";
  //   }else{
  //     return "Chambres";
  //   }
  // }

  // getLotissement(value): any{
  //   if(value == true){
  //     return 'Lotie';
  //   }else{
  //     return 'Non Lotie'
  //   }
  // }

  // getTerassement(value): any{
  //   if(value == true){
  //     return 'Terassé';
  //   }else{
  //     return 'Non Terassé'
  //   }
  // }

  // getCour(value): any{
  //   if(value == true){
  //     return 'Clôturer';
  //   }else{
  //     return 'Non Clôturer'
  //   }
  // }

  get commune(){
    return this.controlForm.get('commune');
  }

  get quartier(){
    return this.controlForm.get('quartier');
  }

  get type(){
    return this.controlForm.get('type');
  }

  get categorie(){
    return this.controlForm.get('categorie');
  }

  get prix_min(){
    return this.controlForm.get('prix_min');
  }

  get prix_max(){
    return this.controlForm.get('prix_max');
  }

  ngOnDestroy() {
    this.loadingBar.stop();
  }
  
}
