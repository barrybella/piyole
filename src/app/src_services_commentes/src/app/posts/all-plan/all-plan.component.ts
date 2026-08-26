import { Socket } from 'ngx-socket-io';
import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-all-plan',
  templateUrl: './all-plan.component.html',
  styleUrls: ['./all-plan.component.css']
})
export class AllPlanComponent implements OnInit {
  posts : any[] = [];
  page?: number = 0;
  chimer: boolean = false;

  constructor(private postService: PostService, public print: PrintService, private socket: Socket) { }

  ngOnInit() {
    this.getAllPostPlans();
    this.socket.on('postList', () => {
      this.getAllPostPlans();
    })
  }

  getAllPostPlans(){
    this.chimer = true;
    this.postService.getAllPostPlansWeb({page: this.page}).subscribe(res => {
    this.chimer = false;
      res.forEach((e: any) => {
        this.posts.push(e);
      })
    })
  }

  onScroll() {
    this.page += 1;
    this.getAllPostPlans();
  }

}
