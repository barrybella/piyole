import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { ListePayementClientComponent } from './../liste-payement-client/liste-payement-client.component';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContratService } from 'src/app/services/contrat.service';
import { UserService } from 'src/app/services/user.service';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-contrat-construction-for-client',
  templateUrl: './list-contrat-construction-for-client.component.html',
  styleUrls: ['./list-contrat-construction-for-client.component.css']
})
export class ListContratConstructionForClientComponent implements OnInit, OnDestroy {
  contrats: Contrat[] = [];
  date_now?: any;

  constructor(private contratService: ContratService, private userService: UserService, public print: PrintService, private dialog: MatDialog, private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.getContratsForConstructionForClient();
    this.date_now = new Date();
    
  }

  onRedirect(route: any, id: any){
    this.router.navigate([route, id]);
  }

  getContratsForConstructionForClient(){
    this.loadingBar.start();
    this.contratService.getContratsForConstructionForClient().subscribe(res => {
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


  getDepense(contrat: any){
    var mont = 0;
    contrat.raports.forEach((res: any) => {
      if(res.delete == 0){
        mont = +(res.montant) + mont;
      }
    });
    return mont;
  }

  getMontantForConstruct(contrat: any){
    var mont = 0;
    contrat.construction_payements.forEach((res: any) => {
      if(res.status == 0){
        mont = +(res.montant) + mont;
      }
    });
    return mont;
  }

  getMontantVersementAgence(contrat: any){
    var mont = 0;
    contrat.agence_versements.forEach((res: any) => {
      if(res.status == 0){
        mont = +(res.montant) + mont;
      }
    });
    return mont;
  }

  monthDiff(d1: any, d2: any) {
    if(d2){
      var d1_params = new Date(d1);
      var d2_params = new Date(d2);

      var months;
      months = (d2_params.getFullYear() - d1_params.getFullYear()) * 12;
      months -= d1_params.getMonth();
      months += d2_params.getMonth();
      return months <= 0 ? 0 : months;
    }else{
      return 0;
    }
  }

  onListePayementClient(contrat: any){
    this.dialog.open(ListePayementClientComponent, {
      width: '800px',
      data: {contrat: contrat}
    })
  }

  onListeVersementAgence(contrat: any){
    // this.dialog.open(ListeVersementAgenceComponent, {
    //   width: '800px',
    //   data: {contrat: contrat}
    // })
  }

  getStatusConstruct(status: number): any{
    if(status == 0){
      return '';
    }else if(status == 1){
      return 'bg-warning text-white';
    }else if(status == 2){
      return 'bg-danger text-white';
    }else if(status == 3){
      return 'bg-success text-white';
    }
  }

  ngOnDestroy(){
    this.loadingBar.complete();
  }
}
