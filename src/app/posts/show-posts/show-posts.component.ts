import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { JsService } from './../../services/js.service';
import { PrintService } from 'src/app/services/print.service';
import { Post } from 'src/app/interfaces/post';
import { Component, Input, OnInit } from '@angular/core';
import { faPersonDigging, faTarp, faDungeon, faFile, faCommenting } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-show-posts',
  templateUrl: './show-posts.component.html',
  styleUrls: ['./show-posts.component.css']
})
export class ShowPostsComponent implements OnInit {
  @Input() posts: Post[] = [];
  @Input() chimer?: boolean = false;

  faPersonDigging = faPersonDigging;
  faTarp = faTarp;
  faDungeon = faDungeon;
  faFile = faFile;
  faCommenting = faCommenting;

  chimers: any[] = ['', '', '', '','', '', '', ''];
  chimers_mobile: any[] = ['', '', ''];

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(public print: PrintService, private js: JsService, private router: Router) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void {
    this.js.jsStart();
    

  }

  /**
   * Détermine le nombre de chambres ou de pièces à afficher.
   */
  getChambreOrPiece(value){
    if(value == 'Maison Habitation' || value == 'Villa' || value == 'Entrer Coucher' || value == 'Studio' || value == 'Appartement' || value == 'Triplex' || value == 'Duplex' || value == 'Imeuble'){
      return 'Chambres';
    }else{
      return "Pièces";
    }
  }

  /**
   * Détermine les informations relatives au lotissement.
   */
  getLotissement(value): any{
    if(value == true){
      return 'Lotie';
    }else{
      return 'Non Lotie'
    }
  }

  /**
   * Détermine les informations relatives au terrassement.
   */
  getTerassement(value): any{
    if(value == true){
      return 'Terassé';
    }else{
      return 'Non Terassé'
    }
  }

  /**
   * Détermine les informations relatives à la cour.
   */
  getCour(value): any{
    if(value == true){
      return 'Clôturer';
    }else{
      return 'Non Clôturer'
    }
  }

  /**
   * Récupère les contacts ou demandes associés à l'utilisateur courant.
   */
  getContacts(post: any){
    var i = 0;
    // console.log("POST ", post);
    post.contact.forEach(res => {
      if(res.status == 0 || res.status == 1){
        i = i + 1;
      }
    });
    return i;
  }

  /**
   * Redirige l'utilisateur vers la page correspondante.
   */
  onRedirect(route: any, params: any){
    this.router.navigate([route, params]);
  }

  /**
   * Retourne ou calcule le nombre d'annonces disponibles.
   */
  lengthPosts(posts: any){
    if(posts == 1){
      return 'col-md-9 col-lg-9 col-xl-9 col-sm-12';
    }else if(posts == 2){
      return 'col-md-5 col-lg-5 col-xl-5 col-sm-12';
    }else{
      return 'col-xl-3 col-lg-4 col-md-6 col-sm-12'
    }
  }

  /**
   * Ouvre le profil de l'utilisateur associé.
   */
  onProfile(post: any){
    if(post?.ing == true){
      this.router.navigate(['posts/all-post-ing']);
    }else{
      this.router.navigate(['', post?.slug_id]);
    }
  }
}
