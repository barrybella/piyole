import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.css']
})
export class ShowProductsComponent implements OnInit {
  @Input() shops: any[] = [];
  @Input() chimer: boolean = false;

  chimers: any[] = ['', '', '', '','', ''];
  chimers_mobile: any[] = ['', '', ''];

  constructor(public print: PrintService, private router: Router) { }

  ngOnInit(): void {
  }

  onDetail(id: any){
    this.router.navigate(['shops/detail-product', id])
  }

  formatText(text: string): string {
    return text.replace(/###\s*(.*?)(\n|$)/g, '<h4 style="font-size: 20px; ">$1</h4><br>').replace(/%%%\s*(.*?)(\n|$)/g, '<h5 style="font-size: 20px; ">$1</h5><br>').replace(/&&&\s*(.*?)(\n|$)/g, '<i style="font-size: 20px; ">$1</i><br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }
}
