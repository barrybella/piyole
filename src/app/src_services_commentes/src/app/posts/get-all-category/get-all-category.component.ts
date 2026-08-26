import { PostService } from 'src/app/services/post.service';
import { PrintService } from './../../services/print.service';
import { ToolsService } from './../../services/tools.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-all-category',
  templateUrl: './get-all-category.component.html',
  styleUrls: ['./get-all-category.component.css']
})
export class GetAllCategoryComponent implements OnInit {
  categories:  any[] = [];
  chimers: any[] = ['', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '','', '', ''];
  chimer?: boolean = true;
  regions_counts: any[] = [];

  constructor(private toolsService: ToolsService, public print: PrintService, private postService: PostService, private router: Router) { }

  ngOnInit(): void {
    this.getCategories();
    this.getCount();
  }

  getCount(){
    this.postService.countPostByRegion().subscribe(res => {
      this.regions_counts = res;
    });
  }

  onGetPostByCommune(region: any){
    this.router.navigate(['posts/get-post-by-ville', region]);
  }

  getCategories(){
    this.toolsService.getCategories().subscribe(res => {
      this.categories = res;
      this.chimer = false;
    })
  }

  getCountRegion(region: any){
    var count = 0;
     if(this.regions_counts.length > 0){
       this.regions_counts.forEach(resp => {
         if(region == resp._id){
           count = resp.count
         }
       })
     }
 
     return count;
   }
}
