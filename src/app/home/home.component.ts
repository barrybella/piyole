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
import Swal from 'sweetalert2';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ShopService } from '../services/shop.service';

// Composant de la page d'accueil : affiche les annonces vedettes (location/vente/plan),
// les boutiques mises en avant, les statistiques globales (nombre d'agences, d'annonces,
// de clients), et le formulaire de recherche rapide (commune/quartier/type/catégorie/prix).
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

  
  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private postService: PostService, @Inject(DOCUMENT) private document: Document, private shopService: ShopService, public print: PrintService, private socket: Socket, private js: JsService, private toolsService: ToolsService, private fb: FormBuilder, private router: Router, public userService: UserService, private loadingBar: LoadingBarService) { }
  // Charge toutes les données nécessaires à la page d'accueil au démarrage : scripts
  // jQuery spécifiques, compteurs, communes, annonces mises en avant, boutiques.
  // S'abonne aussi à l'événement WebSocket "postList" pour rafraîchir automatiquement
  // les annonces affichées dès qu'un changement survient côté serveur.
  ngOnInit() {
    this.js.jsHome();
    this.getCountCategorie();
    this.countPostVenteAndLocation();
    this.countPostPlans();
    
    this.getCommunes();
    
    this.getPostsForPlanHomes();
    this.getPostsHomes();
    this.socket.on('postList', () => {
      this.getPostsForPlanHomes();
      this.getPostsHomes();
    })
    this.getShopHome();
    this.getCount();
    this.countQuartiers();
  }

  // Récupère les statistiques globales affichées sur la page d'accueil : nombre de
  // clients, d'agences, d'annonces totales, et répartition des annonces par région.
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

  // Récupère les annonces mises en avant sur la page d'accueil, avec indicateur
  // de chargement (chimer = effet "shimmer" pendant l'attente).
  getPostsHomes(){
    this.chimer = true;
    this.loadingBar.start();
    this.postService.getPostsHomes().subscribe(res => {
      this.chimer = false;
      this.posts = res;
      this.loadingBar.complete();
    })
  }

  // Retourne le nombre d'annonces appartenant à une catégorie donnée, à partir
  // des compteurs déjà chargés (this.categories).
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

  // Retourne le nombre d'annonces appartenant à une région donnée, à partir
  // des compteurs déjà chargés (this.regions_counts).
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

  // Récupère le nombre total d'annonces de vente et de location.
  countPostVenteAndLocation(){
    this.postService.countPostVenteAndLocation().subscribe(res => {
      this.count_post_vente_and_location = res;
    })
  }

  // Récupère le nombre total d'annonces de type plan.
  countPostPlans(){
    this.postService.countPostPlans().subscribe(res => {
      this.count_post_plans = res;
    })
  }

  // Récupère les boutiques mises en avant sur la page d'accueil.
  getShopHome(){
    this.chimer_product = true;
    this.shopService.getShopHome().subscribe(res => {
      this.chimer_product = false;
      this.shops = res;
    })
  }

  // Récupère jusqu'à 20 annonces à louer (méthode actuellement non appelée dans ngOnInit).
  getPostsForRent(){
    this.postService.getPostsForRent(20).subscribe(res => {
      this.posts = res;
    })
  }

  // Récupère les annonces de type plan mises en avant sur la page d'accueil.
  getPostsForPlanHomes(){
    this.chimer_plans = true;
    this.postService.getPostsForPlanHomes().subscribe(res => {
      this.chimer_plans = false
      this.plans = res;
    })
  }

  // Récupère jusqu'à 15 annonces à vendre (méthode actuellement non appelée dans ngOnInit).
  getPostsForSale(){
    this.postService.getPostsForSale(15).subscribe(res => {
      this.postSales = res;
    })
  }

  // Récupère la liste des communes, pour peupler le formulaire de recherche rapide.
  getCommunes(){
    this.toolsService.getCommunes().subscribe(res => {
      this.communes = res;
    })
  }

  // Récupère le nombre total de quartiers enregistrés.
  countQuartiers(){
    this.toolsService.countQuartiers().subscribe(res => {
      this.count_quartiers = res;
    })
  }

  quartierFileters: any[] = [];
  select_commune: boolean = false;

  commune_ville?: any;
  tab: any[] = [];


    
      
  
  change: boolean = false;
  chargement: boolean = false;

  // Déclenché quand l'utilisateur change la commune sélectionnée dans le formulaire
  // de recherche rapide : recharge la liste des quartiers correspondant à cette commune.
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
  
  // Redirige vers la page de détail publique d'une annonce (URL externe complète).
  onRedirect(id: any){
    this.document.location.href = `${publicUrl}/${id}`;
  }

  // Navigue vers une route donnée avec un paramètre.
  redirect(route: any, params: any){
    this.router.navigate([route, params]);
  }

  // Navigue vers la liste des annonces d'une région/ville donnée.
  onGetPostByCommune(region: any){
    this.router.navigate(['posts/get-post-by-ville', region]);
  }

  // Navigue vers une route donnée (utilisé pour les annonces de type plan).
  redirectPlan(route: any){
    this.router.navigate([route]);
  }

  // Récupère la liste des catégories, avec le nombre d'annonces par catégorie.
  getCountCategorie(){
    this.postService.getCountCategorie().subscribe(res => {
      this.categories = res;
    })
  }

  // Formulaire réactif du bloc de recherche rapide sur la page d'accueil. Les
  // valeurs par défaut ("Commune (ville)", "Categories", etc.) servent de texte
  // indicatif tant que l'utilisateur n'a pas fait de choix.
  controlForm = this.fb.group({
    commune: ['Commune (ville)', [Validators.required]],
    quartier: ['Quartier (secteur)', [Validators.required]],
    type: ['Location ou Vente', [Validators.required]],
    categorie: ['Categories', [Validators.required]],
    prix_min: ['Prix(Min)', [Validators.required]],
    prix_max: ['Prix(Max)', [Validators.required]], 
  });

  // Valide et traite la soumission du formulaire de recherche rapide : synchronise
  // les valeurs depuis le DOM (jQuery) vers le formulaire réactif, vérifie qu'une
  // commune a bien été choisie (seule validation active actuellement, les autres
  // étant commentées/désactivées), puis redirige vers la page de résultats de
  // recherche avec les critères choisis (type location = 0, vente = 1).
  onSubmit(){
    this.etatPadding = true;
    var type_post = 0;
    this.quartier.setValue($('#quartier_ng').attr("value"));
    this.type.setValue($('#type_ng').attr("value"));
    this.categorie.setValue($('#categorie_ng').attr("value"));
    this.prix_min.setValue(+$('#prix_min_ng').attr("value"));
    this.prix_max.setValue(+$('#prix_max_ng').attr("value"));

    
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

    if(this.type.value == 'Location') {
      type_post = 0;
      this.router.navigate(['posts/get-posts-rent-cherch-result', this.commune.value, this.quartier.value, type_post, this.categorie.value, this.prix_min.value, this.prix_max.value]);
    }else{
      type_post = 1;
      this.router.navigate(['posts/get-posts-rent-cherch-result', this.commune.value, this.quartier.value, type_post, this.categorie.value, this.prix_min.value, this.prix_max.value]);
    }
    
  }

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

  // Arrête la barre de chargement lorsque le composant est détruit (changement de page),
  // pour éviter qu'elle reste bloquée en cas de navigation avant la fin d'un chargement.
  ngOnDestroy() {
    this.loadingBar.stop();
  }
  
}
