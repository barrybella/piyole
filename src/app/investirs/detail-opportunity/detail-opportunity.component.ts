import { OnInvestComponent } from './../on-invest/on-invest.component';
import { PrintService } from './../../services/print.service';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

// Page de détail d'une opportunité d'investissement : affiche l'annonce complète
// avec ses conditions/termes d'investissement (non supprimés), et permet d'ouvrir
// le formulaire pour investir.
@Component({
  selector: 'app-detail-opportunity',
  templateUrl: './detail-opportunity.component.html',
  styleUrls: ['./detail-opportunity.component.css']
})
export class DetailOpportunityComponent implements OnInit {
  post: Post;
  terms: any[] = [];

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private route: ActivatedRoute, private postService: PostService, public print: PrintService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPost();
  }

  // Récupère l'annonce d'investissement via l'identifiant présent dans l'URL, et
  // filtre ses termes/conditions pour ne garder que ceux non supprimés.
  getPost(){
    const id = this.route.snapshot.paramMap.get('id');
    this.postService.getPost(id).subscribe(res => {
      this.post = res;
      this.terms = res.terms.filter(result => {
        return result.delete == 0;
      })
    })
  }

  // Ouvre la boîte de dialogue permettant à l'utilisateur d'investir dans l'opportunité.
  onInvest(post: any){
    this.dialog.open(OnInvestComponent, {
      width: '600px',
      data: {post: post}
    })
  }
}
