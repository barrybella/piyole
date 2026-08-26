import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { PrintService } from './../../services/print.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-agence-by-user-id',
  templateUrl: './post-agence-by-user-id.component.html',
  styleUrls: ['./post-agence-by-user-id.component.css']
})
export class PostAgenceByUserIdComponent implements OnInit {
  posts: any[] = [];
  postSales: any[] = [];
  page?: number = 0;
  user?: User;
  chimer: boolean = false;

  constructor(private postService: PostService, private route: ActivatedRoute, public print: PrintService, private userService: UserService) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.getUserBySlug(slug);
    this.getPostsActiveByUser(slug);
  }

  getPostsActiveByUser(slug: any){
    this.chimer = true;
    this.postService.getPostsActiveByUserSlug(slug, {page: this.page}).subscribe(res => {
    this.chimer = false;
      res.forEach((e: any) => {
        this.posts.push(e);
      })
    })
  }

  onScroll() {
    this.page += 1;
    const slug = this.route.snapshot.paramMap.get('slug');
    this.getPostsActiveByUser(slug);
  }

  getUserBySlug(slug: any){
    this.userService.getUserBySlug(slug).subscribe(res => {
      this.user = res;
      console.log("USER USER ", this.user);
      
    })
  }
}
