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

  constructor(private postService: PostService, public print: PrintService, private socket: Socket) { }

  ngOnInit() {
    this.getPostIngs();
    this.socket.on('postList', () => {
      this.getPostIngs();
    })
  }

  getPostIngs(){
    this.chimer = true;
    this.postService.getPostIngs({page: this.page}).subscribe((res: any) => {
      this.chimer = false;
      res.forEach((e: any) => {
        this.posts.push(e);
      })
    })
  }

  onScroll() {
    this.page += 1;
    this.getPostIngs();
  }

}
