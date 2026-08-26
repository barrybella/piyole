import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { JsService } from './../../services/js.service';
import { PrintService } from 'src/app/services/print.service';
import { Post } from 'src/app/interfaces/post';
import { Component, Input, OnInit } from '@angular/core';
import { faPersonDigging, faTarp, faDungeon, faFile, faCommenting } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-show-posts',
  templateUrl: './show-posts.component.html',
  styleUrls: ['./show-posts.component.css']
})
export class ShowPostsComponent implements OnInit {
  @Input() posts: Post[] = [];
  @Input() chimer?: boolean = false;

  faPersonDigging = faPersonDigging;
  faTarp = faTarp;
  faDungeon = faDungeon;
  faFile = faFile;
  faCommenting = faCommenting;

  chimers: any[] = ['', '', '', '','', '', '', ''];
  chimers_mobile: any[] = ['', '', ''];

  constructor(public print: PrintService, private js: JsService, private router: Router) { }

  ngOnInit(): void {
    //  timer(0, 2000).subscribe(res => {
    //   this.js.jsStart();
    // });

    this.js.jsStart();
    //  timer(0, 5000).subscribe(res => {
    // });

  }

  getChambreOrPiece(value){
    if(value == 'Maison Habitation' || value == 'Villa' || value == 'Entrer Coucher' || value == 'Studio' || value == 'Appartement' || value == 'Triplex' || value == 'Duplex' || value == 'Imeuble'){
      return 'Chambres';
    }else{
      return "Pièces";
    }
  }

  getLotissement(value): any{
    if(value == true){
      return 'Lotie';
    }else{
      return 'Non Lotie'
    }
  }

  getTerassement(value): any{
    if(value == true){
      return 'Terassé';
    }else{
      return 'Non Terassé'
    }
  }

  getCour(value): any{
    if(value == true){
      return 'Clôturer';
    }else{
      return 'Non Clôturer'
    }
  }

  getContacts(post: any){
    var i = 0;
    // console.log("POST ", post);
    post.contact.forEach(res => {
      if(res.status == 0 || res.status == 1){
        i = i + 1;
      }
    });
    return i;
  }

  onRedirect(route: any, params: any){
    this.router.navigate([route, params]);
  }

  lengthPosts(posts: any){
    if(posts == 1){
      return 'col-md-9 col-lg-9 col-xl-9 col-sm-12';
    }else if(posts == 2){
      return 'col-md-5 col-lg-5 col-xl-5 col-sm-12';
    }else{
      return 'col-xl-3 col-lg-4 col-md-6 col-sm-12'
    }
  }

  onProfile(post: any){
    if(post?.ing == true){
      this.router.navigate(['posts/all-post-ing']);
    }else{
      this.router.navigate(['', post?.slug_id]);
    }
  }
}
