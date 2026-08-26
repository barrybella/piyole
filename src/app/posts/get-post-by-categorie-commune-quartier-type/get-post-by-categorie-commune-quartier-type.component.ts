import { PrintService } from 'src/app/services/print.service';
import { Post } from 'src/app/interfaces/post';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-get-post-by-categorie-commune-quartier-type',
  templateUrl: './get-post-by-categorie-commune-quartier-type.component.html',
  styleUrls: ['./get-post-by-categorie-commune-quartier-type.component.css']
})
export class GetPostByCategorieCommuneQuartierTypeComponent implements OnInit {
  posts: Post[] = [];
  type: boolean = true;
  page?: number = 0;
  chimer: boolean = true;

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private titleService: Title, private postService: PostService, private route: ActivatedRoute, public print: PrintService) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void {
  
    this.getPostsByCommuneQuartierCategorie();

  }

  /**
   * Récupère les annonces selon la commune, le quartier et la catégorie.
   */
  getPostsByCommuneQuartierCategorie(){
    const categorie = this.route.snapshot.paramMap.get('categorie');
    const commune = this.route.snapshot.paramMap.get('commune');
    const quartier = this.route.snapshot.paramMap.get('quartier');

    var titre = "Tout(e) les " + categorie + " à acheter ou louer dans la commune de " + commune + " quartier " + quartier; 
    this.titleService.setTitle(titre || 'PIYOLE GROUP SARLU');
    
    this.postService.getPostsByCommuneQuartierCategorie(categorie, commune, quartier, {page: this.page}).subscribe((res: any) => {
      this.chimer = false;
      res.forEach((e: any) => {
        this.posts.push(e);
      })
    })
  }

  /**
   * Gère le défilement et charge les données supplémentaires lorsque nécessaire.
   */
  onScroll() {
    this.page += 1;
    this.getPostsByCommuneQuartierCategorie();
  }
}
