import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { PrintService } from 'src/app/services/print.service';
import { AddBesoinComponent } from 'src/app/tools/add-besoin/add-besoin.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-get-posts-sale-cherch-result',
  templateUrl: './get-posts-sale-cherch-result.component.html',
  styleUrls: ['./get-posts-sale-cherch-result.component.css']
})
export class GetPostsSaleCherchResultComponent implements OnInit {
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

  count_sale?: number = 0;

  page?: number = 0;
  chimer: boolean = false;
  chimer_deux: boolean = false;


  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private postService: PostService, private route: ActivatedRoute, public print: PrintService, private dialog: MatDialog) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void {
    // this.getPosts();
    this.getPostsNotBetweens();
    this.getPostsResult();
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
    
    this.postService.getPostToCherch(this.route.snapshot.paramMap.get('commune'), this.route.snapshot.paramMap.get('quartier'), 1, this.route.snapshot.paramMap.get('categorie'), this.min, this.max, {page: this.page}).subscribe(res => {
     this.chimer = false;
      res.forEach((e: any) => {
        this.posts.push(e);
      });
      if(this.posts.length == 0){
        Swal.fire({
          icon: 'info',
          title: 'Pas de resultat...',
          text: 'Vous pouvez enregistrer votre besoin pour qu\'on puisse vous aidez à trouver ceque vous cherchez!!',
        })
      }
    });
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
    this.postService.getPostsForSale().subscribe(res => {
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
    
    this.postService.getPostsResultNotBetweenPrix(this.route.snapshot.paramMap.get('commune'), this.route.snapshot.paramMap.get('quartier'), 1, this.route.snapshot.paramMap.get('categorie'), this.min, this.max).subscribe(res => {
      this.chimer_deux = false;
      this.posts_not_between_results = res;
    });
  }

  /**
   * Prépare l'ajout d'un besoin à partir du contexte courant.
   */
  onAddBesoin(){
    this.dialog.open(AddBesoinComponent, {
      width: '550px',
      disableClose: true
    })
  }
}
