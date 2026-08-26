import { LoadingBarService } from '@ngx-loading-bar/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { PrintService } from 'src/app/services/print.service';
import { AddBesoinComponent } from 'src/app/tools/add-besoin/add-besoin.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-get-post-cherch-result',
  templateUrl: './get-post-cherch-result.component.html',
  styleUrls: ['./get-post-cherch-result.component.css']
})
export class GetPostCherchResultComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  postings: Post[] = [];
  posts_quartiers: Post[] = [];
  posts_communes: Post[] = [];
  posts_categories: Post[] = [];
  posts_not_between_results: Post[] = [];
  commune: any;
  quartier: any;
  categorie: any;
  min: number = 0;
  max: number = 0;
  type: number = 0;
  count_loc?: number = 0;

  page?: number = 0;
  chimer: boolean = false;
  chimer_deux: boolean = false;
  chimer_tois: boolean = false;

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private postService: PostService, private route: ActivatedRoute, public print: PrintService, private dialog: MatDialog, private loadingBar: LoadingBarService) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void {
    this.loadingBar.start();
    this.getPostsResult();
    this.countPostLocation();
    // this.getPosts();
    this.getPostsNotBetweens();
    this.getPostsByCategoryForRent();
  }

  /**
   * Récupère les résultats correspondant aux critères de recherche.
   */
  getPostsResult(){
    this.chimer = true;
    this.commune = this.route.snapshot.paramMap.get('commune');
    this.quartier = this.route.snapshot.paramMap.get('quartier');
    this.categorie = this.route.snapshot.paramMap.get('categorie');
    this.min = +this.route.snapshot.paramMap.get('min');
    this.max = +this.route.snapshot.paramMap.get('max');
    this.type = +this.route.snapshot.paramMap.get('type');
    
    this.postService.getPostToCherch(this.route.snapshot.paramMap.get('commune'), this.route.snapshot.paramMap.get('quartier'), this.type, this.route.snapshot.paramMap.get('categorie'), this.min, this.max,  {page: this.page}).subscribe(res => {
      this.chimer = false;
      res.forEach((e: any) => {
        this.posts.push(e);
      });
      if(this.posts.length == 0){
        Swal.fire({
          icon: 'info',
          title: 'Pas de résultat!',
          text: "Vous pouvez enregistrer votre besoin pour qu'on puisse vous aider à trouver ce que vous cherchez!!",
        })
      }
    });
  }

  /**
   * Compte les annonces correspondant à une localisation donnée.
   */
  countPostLocation(){
    this.postService.countPostLocation().subscribe(res => {
      this.count_loc = res;
    })
  }

  /**
   * Gère l'action déclenchée lors d'un clic utilisateur.
   */
  onClick(){
    Swal.fire(
      'The Internet?',
      'That thing is still around?',
      'question'
    )
  }

  /**
   * Récupère la liste des annonces correspondant aux critères courants.
   */
  getPosts() {
    this.postService.getPostsForRent().subscribe(res => {
      this.postings = res;

      this.posts_categories = res.filter(resp => {
        var quartier_split = resp.quartier.split(' ')[0];
        var quartier_params = this.quartier.split(' ')[0];
        
        return resp.commune == this.route.snapshot.paramMap.get('commune') && quartier_split == quartier_params && resp.categorie == this.categorie;
      });

      this.posts_quartiers = res.filter(resp => {
        var quartier_split = resp.quartier.split(' ')[0];
        var quartier_params = this.quartier.split(' ')[0];
        
        return resp.commune == this.route.snapshot.paramMap.get('commune') && quartier_split == quartier_params;
      });

      this.posts_communes = res.filter(resp => {
        return resp.commune == this.route.snapshot.paramMap.get('commune');
      })
      
    });
  }

  /**
   * Récupère les annonces qui ne correspondent pas à l'intervalle défini.
   */
  getPostsNotBetweens(){
    this.chimer_deux = true;
    this.commune = this.route.snapshot.paramMap.get('commune');
    this.quartier = this.route.snapshot.paramMap.get('quartier');
    this.categorie = this.route.snapshot.paramMap.get('categorie');
    this.min = +this.route.snapshot.paramMap.get('min');
    this.max = +this.route.snapshot.paramMap.get('max');
    
    this.postService.getPostsResultNotBetweenPrix(this.route.snapshot.paramMap.get('commune'), this.route.snapshot.paramMap.get('quartier'), 0, this.route.snapshot.paramMap.get('categorie'), this.min, this.max).subscribe(res => {
      this.posts_not_between_results = res;
      this.chimer_deux = false;
      if(res.length == 0){
        
      }
    });
  }

  /**
   * Récupère les annonces de la catégorie destinées à la location.
   */
  getPostsByCategoryForRent(){
    this.chimer_tois = true;
    this.categorie = this.route.snapshot.paramMap.get('categorie');
    
    
    this.postService.getPostsByCategoryForRent(this.categorie,  {page: this.page} ).subscribe(res => {
      this.chimer_tois = false;
      res.forEach((e: any) => {
        this.posts_categories.push(e);
      });
      this.loadingBar.complete();
    });
  }

  /**
   * Prépare l'ajout d'un besoin à partir du contexte courant.
   */
  onAddBesoin(){
    this.dialog.open(AddBesoinComponent, {
      width: '600px',
      disableClose: true
    })
  }

  /**
   * Gère le défilement et charge les données supplémentaires lorsque nécessaire.
   */
  onScroll() {
    this.page += 1;
    this.getPostsResult();
    this.getPostsByCategoryForRent();
    if(this.posts_not_between_results.length == 0){
    }
  } 

  /**
   * Libère les ressources et nettoie les abonnements avant la destruction du composant.
   */
  ngOnDestroy(){
    this.loadingBar.complete();
  }
}
