import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { StopContratComponent } from './../stop-contrat/stop-contrat.component';
import { AddResiliationComponent } from './../add-resiliation/add-resiliation.component';
import   Swal from 'sweetalert2';
import { AddPresAvisComponent } from './../add-pres-avis/add-pres-avis.component';
import { Socket } from 'ngx-socket-io';
import { UpdatePrixComponent } from './../update-prix/update-prix.component';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContratService } from 'src/app/services/contrat.service';
import { UserService } from 'src/app/services/user.service';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-contrat-mensuel-client',
  templateUrl: './list-contrat-mensuel-client.component.html',
  styleUrls: ['./list-contrat-mensuel-client.component.css']
})
export class ListContratMensuelClientComponent implements OnInit, OnDestroy {
  contrats: Contrat[] = [];
  p: number = 1;
  constructor(private contratService: ContratService, private userService: UserService, public print: PrintService, private dialog: MatDialog, private socket: Socket, private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.getContrats();
    this.socket.on('contrat_emit', () => {
      this.getContrats(); 
     });
    
  }

  getContrats(){
    this.loadingBar.start();
    this.contratService.getContratMensuelsForClient().subscribe(res => {
      this.loadingBar.complete();
      this.contrats = res;
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

  onUpdatePrix(contrat: any){
    this.dialog.open(UpdatePrixComponent, {
      width: '500px',
      data:{contrat: contrat}
    })
  }

  addPresAvis(contrat: any){
    this.dialog.open(AddPresAvisComponent, {
      width: '550px',
      data: {contrat: contrat},
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
        })
      }
    });
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


  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  monthDiff(d1: any, d2: any) { var months; months = (d2.getFullYear() - d1.getFullYear()) * 12; months -= d1.getMonth(); months += d2.getMonth(); return months <= 0 ? 0 : months; }

  ngOnDestroy(){
    this.loadingBar.complete();
  }

}
