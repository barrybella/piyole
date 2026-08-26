import { OnInvestComponent } from './../on-invest/on-invest.component';
import { PrintService } from './../../services/print.service';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-opportunity',
  templateUrl: './detail-opportunity.component.html',
  styleUrls: ['./detail-opportunity.component.css']
})
export class DetailOpportunityComponent implements OnInit {
  post: Post;
  terms: any[] = [];

  constructor(private route: ActivatedRoute, private postService: PostService, public print: PrintService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(){
    const id = this.route.snapshot.paramMap.get('id');
    this.postService.getPost(id).subscribe(res => {
      this.post = res;
      this.terms = res.terms.filter(result => {
        return result.delete == 0;
      })
    })
  }

  onInvest(post: any){
    this.dialog.open(OnInvestComponent, {
      width: '600px',
      data: {post: post}
    })
  }
}
