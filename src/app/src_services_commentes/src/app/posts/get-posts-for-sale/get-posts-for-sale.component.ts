import { Socket } from 'ngx-socket-io';
import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-get-posts-for-sale',
  templateUrl: './get-posts-for-sale.component.html',
  styleUrls: ['./get-posts-for-sale.component.css']
})
export class GetPostsForSaleComponent implements OnInit {
  posts : any[] = [];
  page?: number = 0;
  chimer: boolean = false;

  constructor(private postService: PostService, public print: PrintService, private socket: Socket) { }

  ngOnInit() {
    this.getPostsSales();
    this.socket.on('postList', () => {
      this.getPostsSales();
    })
  }

  getPostsSales(){
    this.chimer = true;
    this.postService.getPostsSales({page: this.page}).subscribe((res: any) => {
      this.chimer = false;
      res.forEach((e: any) => {
        this.posts.push(e);
      })
    })
  }

  onScroll() {
    this.page += 1;
    this.getPostsSales();
  }
}
