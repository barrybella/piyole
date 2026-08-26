import { Socket } from 'ngx-socket-io';
import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-lands',
  templateUrl: './lands.component.html',
  styleUrls: ['./lands.component.css']
})
export class LandsComponent implements OnInit {
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
    this.getAllPostTerrains();
    this.socket.on('postList', () => {
      this.getAllPostTerrains();
    })
  }

  /**
   * Récupère l'ensemble des annonces de terrains.
   */
  getAllPostTerrains(){
    this.chimer = true;
    this.postService.getAllPostTerrains({page: this.page}).subscribe((res: any) => {
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
    this.getAllPostTerrains();
  }
}
