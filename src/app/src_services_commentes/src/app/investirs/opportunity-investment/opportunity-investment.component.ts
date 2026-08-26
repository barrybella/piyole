import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opportunity-investment',
  templateUrl: './opportunity-investment.component.html',
  styleUrls: ['./opportunity-investment.component.css']
})
export class OpportunityInvestmentComponent implements OnInit {
  posts: Post[] = [];
  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.getPostsForInvest();
  }

  getPostsForInvest(){
    this.postService.getPostsForInvest().subscribe(res => {
      this.posts = res;
      console.log('POST POST', this.posts);
      
    })
  }
}
