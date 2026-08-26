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
  selector: 'app-list-contrat-vente-client',
  templateUrl: './list-contrat-vente-client.component.html',
  styleUrls: ['./list-contrat-vente-client.component.css']
})
export class ListContratVenteClientComponent implements OnInit, OnDestroy {
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
    this.contratService.getContratVentesClient().subscribe(res => {
      this.loadingBar.complete();
      this.contrats = res;
    })
  }

  addPresAvis(contrat: any){
    this.dialog.open(AddPresAvisComponent, {
      width: '550px',
      data: {contrat: contrat},
      disableClose: true
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


  onUpdatePrix(contrat: any){
    this.dialog.open(UpdatePrixComponent, {
      width: '500px',
      data:{contrat: contrat},
      disableClose: true
    })
  }

  onDetail(id: any){
    this.router.navigate(['posts/result-recherch-by-post-id', id]);
  }

  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }

  onRedirect(route: any, id: any){
    this.router.navigate([route, id]);
  }

  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  onDetailContrat(contrat: any){
    this.router.navigate(['contrats/detail-contrat', contrat._id]);
  }

  monthDiff(d1: any, d2: any) { var months; months = (d2.getFullYear() - d1.getFullYear()) * 12; months -= d1.getMonth(); months += d2.getMonth(); return months <= 0 ? 0 : months; }

  ngOnDestroy(){
    this.loadingBar.complete();
  }

}
