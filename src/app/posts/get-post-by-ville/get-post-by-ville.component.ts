import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { Socket } from 'ngx-socket-io';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-get-post-by-ville',
  templateUrl: './get-post-by-ville.component.html',
  styleUrls: ['./get-post-by-ville.component.css']
})
export class GetPostByVilleComponent implements OnInit {
  posts: Post[] = [];
  region?: any;
  page?: number = 0;
  chimer: boolean = false;

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private postService: PostService, private route: ActivatedRoute, public print: PrintService, private socket: Socket) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void { 
    this.getPostsByCategoryScrolings();
  }


  /**
   * Récupère les annonces de la catégorie avec prise en charge du défilement.
   */
  getPostsByCategoryScrolings(){
    this.chimer = true;
    const region = this.route.snapshot.paramMap.get('region');
    this.region = region;
    this.postService.getPostsByVille(region, {page: this.page}).subscribe((res: any) => {
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
    this.getPostsByCategoryScrolings();
  } 
}
