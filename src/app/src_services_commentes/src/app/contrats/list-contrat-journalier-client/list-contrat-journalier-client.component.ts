import { LoadingBarService } from '@ngx-loading-bar/core';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { PrintService } from 'src/app/services/print.service';
import { StopContratComponent } from './../stop-contrat/stop-contrat.component';
import { Router } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import  Swal from 'sweetalert2';
import { AddResiliationComponent } from './../add-resiliation/add-resiliation.component';
import { Socket } from 'ngx-socket-io';
import { UpdatePrixComponent } from './../update-prix/update-prix.component';
import { AddPresAvisComponent } from './../add-pres-avis/add-pres-avis.component';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContratService } from 'src/app/services/contrat.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-contrat-journalier-client',
  templateUrl: './list-contrat-journalier-client.component.html',
  styleUrls: ['./list-contrat-journalier-client.component.css']
})
export class ListContratJournalierClientComponent implements OnInit, OnDestroy {
  contrats: Contrat[] = [];
  post?: any;
  p: number = 1;

  constructor(private contratService: ContratService, private userService: UserService, private dialog: MatDialog, private socket: Socket, private router: Router, public print: PrintService, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.getContrats();
    this.socket.on('contrat_emit', () => {
      this.getContrats(); 
     });
  }

  getContrats(){
    this.loadingBar.start();
    this.contratService.getContratJournaliersForClient_Piyole().subscribe(res => {
      this.contrats = res;
      this.loadingBar.complete();
    })
  }

  addPresAvis(contrat: any){
    this.dialog.open(AddPresAvisComponent, {
      width: '550px',
      data: {contrat: contrat},
      disableClose: true
    })
  }

  addResiliation(contrat: any){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête entrain d'annuler cette attretient!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, declinez-le !',
      cancelButtonText: 'Annuler'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.dialog.open(AddResiliationComponent, {
          width: '550px',
          data: {contrat: contrat},
          disableClose: true
        })
      }
    });
  }

  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }

  stopContrat(contrat: any){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous ête entrain d'annuler cette attretient!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, declinez-le !',
      cancelButtonText: 'Annuler'
    }).then((result: any) => {
      if (result.isConfirmed) {
        
        console.log("JNP ", this.print.printDayNotPay(contrat).heure);
        if(this.print.printDayNotPay(contrat).heure <= 10){
          this.dialog.open(StopContratComponent, {
            width: '550px',
            data: {contrat: contrat},
            disableClose: true
          })
        }else{
          Swal.fire("Impossible", this.print.printDayNotPay(contrat).heure.toFixed(2) + " heures c'est écouler vous devez payer le jour", "warning");
        }
        
        
      } 
    });
  }

  onUpdatePrix(contrat: any){
    this.dialog.open(UpdatePrixComponent, {
      width: '500px',
      data:{contrat: contrat},
      disableClose: true
    })
  }

  // testDays(heure: any, days: any): any{
  //   if(heure < 24 ){
  //     return 0;
  //   }else{
  //     return days
  //   }
  // }

  onDetail(id: any){
    this.router.navigate(['posts/result-recherch-by-post-id', id]);
  }

  onDetailContrat(contrat: any){
    this.router.navigate(['contrats/detail-contrat', contrat._id]);
  }

  onRedirect(route: any, id: any){
    this.router.navigate([route, id]);
  }

  test(contrat: any): any{
    var i = 0;
    var month_verifie = 0;
    var payement: any = null;
    var response_status = '';
    i = contrat.payements.length;
    // var payements_tab = contrat.payements;
    payement = contrat.payements[i-1];
    var date = new Date();
  
    var date_demo = new Date(payement?.year+'-'+payement?.month+'-'+28);
    
    month_verifie = this.monthDiff(date_demo, date);

    if(month_verifie <= 0){
      response_status = '';
      // response_status = 'success text-white';
    }else if(month_verifie == 1){
      response_status = 'warning text-white'
    }else if(month_verifie > 1){
      response_status = 'danger text-white'
    }

    var object = {
      "response_status": response_status,
      "month_verifie": month_verifie
    }
    
    return object;
  }

  monthDiff(d1: any, d2: any) { var months; months = (d2.getFullYear() - d1.getFullYear()) * 12; months -= d1.getMonth(); months += d2.getMonth(); return months <= 0 ? 0 : months; }

  ngOnDestroy(){
    this.loadingBar.complete();
  }

}
