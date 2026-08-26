import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { Socket } from 'ngx-socket-io';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-get-posts-by-categorie-for-rent',
  templateUrl: './get-posts-by-categorie-for-rent.component.html',
  styleUrls: ['./get-posts-by-categorie-for-rent.component.css']
})
export class GetPostsByCategorieForRentComponent implements OnInit {
  posts_rents: Post[] = [];
  posts_sales: Post[] = [];
  categorie?: any;
  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private postService: PostService, private route: ActivatedRoute, public print: PrintService, private socket: Socket) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void {
    this.getPostsForRent();
    this.socket.on('postList', () => {
      this.getPostsForRent();
    })
  }

  /**
   * Récupère les annonces d'une catégorie destinées à la location.
   */
  getPostsForRent(){
    const categorie = this.route.snapshot.paramMap.get('categorie');
    this.categorie = categorie;
   
  }
}
