import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { Socket } from 'ngx-socket-io';
import { PrintService } from 'src/app/services/print.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-get-post-by-category',
  templateUrl: './get-post-by-category.component.html',
  styleUrls: ['./get-post-by-category.component.css']
})
export class GetPostByCategoryComponent implements OnInit {
  posts: Post[] = [];
  categorie?: any;
  page?: number = 0;
  chimer: boolean = false;

  constructor(private titleService: Title, private postService: PostService, private route: ActivatedRoute, public print: PrintService, private socket: Socket) { }

  ngOnInit(): void { 
    this.getPostsByCategoryScrolings();
  }


  getPostsByCategoryScrolings(){
    this.chimer = true;
    const categorie = this.route.snapshot.paramMap.get('categorie');
    this.categorie = categorie;
    var titre = "Tout(e) les " + categorie + " à Acheter ou à Louer partout en Guinée Conakry";

    this.titleService.setTitle(titre || 'PIYOLE GROUP SARLU');
    this.postService.getPostsByCategoryScrolings(categorie, {page: this.page}).subscribe((res: any) => {
    this.chimer = false;
      res.forEach((e: any) => {
        this.posts.push(e);
      })
    })
  }

  onScroll() {
    this.page += 1;
    this.getPostsByCategoryScrolings();
  } 

}
