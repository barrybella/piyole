import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-post-rent-sale-random',
  templateUrl: './all-post-rent-sale-random.component.html',
  styleUrls: ['./all-post-rent-sale-random.component.css']
})
export class AllPostRentSaleRandomComponent implements OnInit {
  posts?: any[] = [];
  page?: number = 0;
  chimer: boolean = false;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.getAllPostRentSale();
  }



  getAllPostRentSale(){
    this.chimer = true;
    this.postService.getAllPostRentSale({page: this.page}).subscribe(res => {
    this.chimer = false;
      res.forEach((e: any) => {
        this.posts.push(e);
      })
    })
  }

  onScroll() {
    this.page += 1;
    this.getAllPostRentSale();
  }
}
