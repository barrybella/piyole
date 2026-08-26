import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { MatDialog } from '@angular/material/dialog';
import { VoirPlusComponent } from 'src/app/voir-plus/voir-plus.component';
import { PrintService } from 'src/app/services/print.service';
import { ContratService } from 'src/app/services/contrat.service';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-liste-resilier',
  templateUrl: './liste-resilier.component.html',
  styleUrls: ['./liste-resilier.component.css']
})
export class ListeResilierComponent implements OnInit, OnDestroy {
  contrats?: Contrat[] = [];

  constructor(private contratService: ContratService, public print: PrintService, private dialog: MatDialog, private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.getContratResilier();
  }

  getContratResilier(){
    this.loadingBar.start();
    this.contratService.getContratResilier().subscribe(res => {
      this.contrats = res;
      this.loadingBar.complete();
    })
  }

  onVoirPlus(text: any){
    this.dialog.open(VoirPlusComponent, {
      data: {text: text},
      width: '500px'
    })
  }

  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }

  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  onRedirect(route: any, id: any){
    this.router.navigate([route, id]);
  }

  onDetail(id: any){
    this.router.navigate(['posts/result-recherch-by-post-id', id]);
  }

  onDetailContrat(contrat: any){
    this.router.navigate(['contrats/detail-contrat', contrat._id]);
  }

  ngOnDestroy(){
    this.loadingBar.complete();
  }
}
