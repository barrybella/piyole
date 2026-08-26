import { Socket } from 'ngx-socket-io';
import { PrintService } from 'src/app/services/print.service';
import { PostService } from './../../services/post.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-post-ing',
  templateUrl: './all-post-ing.component.html',
  styleUrls: ['./all-post-ing.component.css']
})
export class AllPostIngComponent implements OnInit {
  posts : any[] = [];
  page?: number = 0;
  chimer: boolean = false;

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private postService: PostService, public print: PrintService, private socket: Socket) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit() {
    this.getPostIngs();
    this.socket.on('postList', () => {
      this.getPostIngs();
    })
  }

  /**
   * Récupère les annonces du type concerné.
   */
  getPostIngs(){
    this.chimer = true;
    this.postService.getPostIngs({page: this.page}).subscribe((res: any) => {
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
    this.getPostIngs();
  }

}
