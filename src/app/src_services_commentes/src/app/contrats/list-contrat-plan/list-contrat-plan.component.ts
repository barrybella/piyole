import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContratService } from 'src/app/services/contrat.service';
import { UserService } from 'src/app/services/user.service';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-contrat-plan',
  templateUrl: './list-contrat-plan.component.html',
  styleUrls: ['./list-contrat-plan.component.css']
})
export class ListContratPlanComponent implements OnInit, OnDestroy {
  contrats: Contrat[] = [];
  p: number = 1;
  
  constructor(private contratService: ContratService, private userService: UserService, public print: PrintService, private dialog: MatDialog, private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.getContratsForPlanForAgence();
    
  }

  getContratsForPlanForAgence(){
    this.loadingBar.start();
    this.contratService.getContratsForPlanForAgence().subscribe(res => {
      this.contrats = res;
      this.loadingBar.complete();
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

  getTypeContrat(type){
    if(type == 0){
      return 'Mensuel';
    }else if(type == 1){
      return 'Journalier';
    }else if(type == 2){
      return 'Pas de suivie';
    }
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
