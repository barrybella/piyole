import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
import { Post } from 'src/app/interfaces/post';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-plans',
  templateUrl: './show-plans.component.html',
  styleUrls: ['./show-plans.component.css']
})
export class ShowPlansComponent implements OnInit {
  @Input() plans: Post[] = [];
  @Input() chimer?: boolean = false;
  chimers: any[] = ['', '', '','', '', '']
  chimers_mobile: any[] = ['', '', '']

  constructor(public print: PrintService, private router: Router) { }

  ngOnInit(): void {
  }

  onRedirect(route: any, params: any){
    this.router.navigate([route, params]);
  }
}
