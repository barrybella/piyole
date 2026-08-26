import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';

// Liste des opportunités d'investissement disponibles (annonces de type "invest").
@Component({
  selector: 'app-opportunity-investment',
  templateUrl: './opportunity-investment.component.html',
  styleUrls: ['./opportunity-investment.component.css']
})
export class OpportunityInvestmentComponent implements OnInit {
  posts: Post[] = [];
  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.getPostsForInvest();
  }

  // Récupère la liste des annonces ouvertes à l'investissement.
  getPostsForInvest(){
    this.postService.getPostsForInvest().subscribe(res => {
      this.posts = res;
      
    })
  }
}
