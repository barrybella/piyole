import { PostService } from 'src/app/services/post.service';
import { PrintService } from './../../services/print.service';
import { ToolsService } from './../../services/tools.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-all-category',
  templateUrl: './get-all-category.component.html',
  styleUrls: ['./get-all-category.component.css']
})
export class GetAllCategoryComponent implements OnInit {
  categories:  any[] = [];
  chimers: any[] = ['', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '','', '', ''];
  chimer?: boolean = true;
  regions_counts: any[] = [];

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private toolsService: ToolsService, public print: PrintService, private postService: PostService, private router: Router) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void {
    this.getCategories();
    this.getCount();
  }

  /**
   * Récupère ou calcule le nombre d'éléments correspondant aux critères courants.
   */
  getCount(){
    this.postService.countPostByRegion().subscribe(res => {
      this.regions_counts = res;
    });
  }

  /**
   * Exécute le traitement associé à la méthode « onGetPostByCommune ».
   */
  onGetPostByCommune(region: any){
    this.router.navigate(['posts/get-post-by-ville', region]);
  }

  /**
   * Récupère la liste des catégories disponibles.
   */
  getCategories(){
    this.toolsService.getCategories().subscribe(res => {
      this.categories = res;
      this.chimer = false;
    })
  }

  /**
   * Récupère ou calcule le nombre d'éléments par région.
   */
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
}
