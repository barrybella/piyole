import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ListeVersementAgenceComponent } from './../liste-versement-agence/liste-versement-agence.component';
import { AddRaportComponent } from './../add-raport/add-raport.component';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContratService } from 'src/app/services/contrat.service';
import { UserService } from 'src/app/services/user.service';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';
import { AddRaportForChantierComponent } from '../add-raport-for-chantier/add-raport-for-chantier.component';
import { AddChantierComponent } from '../add-chantier/add-chantier.component';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-contrat-suivie-chantier',
  templateUrl: './contrat-suivie-chantier.component.html',
  styleUrls: ['./contrat-suivie-chantier.component.css']
})
export class ContratSuivieChantierComponent implements OnInit {
  contrats: Contrat[] = [];
  constructor(private contratService: ContratService, private userService: UserService, public print: PrintService, private dialog: MatDialog, private socket: Socket, private router: Router, private loadingBar: LoadingBarService) { }
  date_now?: any;
  p: number = 1;
  count: number = 10;
  subscription: Subscription;

  ngOnInit(): void {
    this.subscription = timer(0, 3000).subscribe(res => {
      this.getContratsSuivieChantier();
      console.log("BONJOUR ");
      
    }); 
    // this.socket.on('payement_construct_emit', () => {
    //   this.getContratsSuivieChantier();
    //  });
    this.date_now = new Date();
  }

  getContratsSuivieChantier(){
    this.loadingBar.start();
    this.contratService.getContratsSuivieChantier().subscribe(res => {
      this.contrats = res;
      this.loadingBar.complete();
    })
  }

  getCountParticipants(contrat){
    var count = 12;
    console.log("CONTRAT ", contrat);
    
    // contrat.participants.forEach(response => {
    //   if(response.delete == 0){
    //     // count++;
    //   }
    // })

    return count;
  }

  onAddChantier(){
    this.dialog.open(AddChantierComponent, {
      width: '600px',
    })
  }

  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }

  onAddRaport(contrat){
    this.dialog.open(AddRaportForChantierComponent, {
      width: '600px',
      data: {contrat: contrat},
      disableClose: true
    })
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

  getDepense(contrat){
    var mont = 0;
    contrat.raports.forEach(res => {
      if(res.delete == 0){
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

  onListeVersementAgence(contrat: any){
    this.dialog.open(ListeVersementAgenceComponent, {
      width: '800px',
      data: {contrat: contrat}
    })
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

  onDetail(id: any){
    this.router.navigate(['posts/result-recherch-by-post-id', id]);
  }

  onDetailContrat(contrat: any){
    this.router.navigate(['contrats/detail-contrat', contrat._id]);
  }

  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.loadingBar.complete();
  }
}
