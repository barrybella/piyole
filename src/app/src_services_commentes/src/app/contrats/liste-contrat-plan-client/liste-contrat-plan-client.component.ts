import { LoadingBarService } from '@ngx-loading-bar/core';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContratService } from 'src/app/services/contrat.service';
import { UserService } from 'src/app/services/user.service';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-liste-contrat-plan-client',
  templateUrl: './liste-contrat-plan-client.component.html',
  styleUrls: ['./liste-contrat-plan-client.component.css']
})
export class ListeContratPlanClientComponent implements OnInit, OnDestroy {
  contrats: Contrat[] = [];
  constructor(private contratService: ContratService, private userService: UserService, public print: PrintService, private dialog: MatDialog, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.getContratsForPlanForClient();
    
  }

  getContratsForPlanForClient(){
    this.loadingBar.start();
    this.contratService.getContratsForPlanForClient().subscribe(res => {
      this.contrats = res;
      this.loadingBar.complete();
    })
  }

  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
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

  ngOnDestroy(){
    this.loadingBar.complete();
  }
}
