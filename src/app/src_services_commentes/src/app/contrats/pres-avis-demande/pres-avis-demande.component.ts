import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { PrintService } from './../../services/print.service';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { MatDialog } from '@angular/material/dialog';
import { StopContratComponent } from './../stop-contrat/stop-contrat.component';
import  Swal from 'sweetalert2';
import { Contrat } from './../../interfaces/contrat';
import { ContratService } from 'src/app/services/contrat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-pres-avis-demande',
  templateUrl: './pres-avis-demande.component.html',
  styleUrls: ['./pres-avis-demande.component.css']
})
export class PresAvisDemandeComponent implements OnInit, OnDestroy {
  contrats?: Contrat[] = [];

  constructor(private contratService: ContratService, private dialog: MatDialog, public print: PrintService, private socket: Socket, private router: Router, private loadingBar: LoadingBarService) { }

  ngOnInit(): void {
    this.getPresAvisDemmander();
    this.socket.on('contrat_emit', () => {
      this.getPresAvisDemmander(); 
     });
  }

  getPresAvisDemmander(){
    this.loadingBar.start();
    this.contratService.getPresAvisDemmander().subscribe(res => {
      this.contrats = res;
      this.loadingBar.complete();
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
        this.dialog.open(StopContratComponent, {
          width: '550px',
          data: {contrat: contrat},
        })
      }
    });
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

  ngOnDestroy(){
    this.loadingBar.complete();
  }
}
