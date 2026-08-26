import { Router } from '@angular/router';
import { StopContratComponent } from './../stop-contrat/stop-contrat.component';
import { AddResiliationComponent } from './../add-resiliation/add-resiliation.component';
import   Swal from 'sweetalert2';
import { AddPresAvisComponent } from './../add-pres-avis/add-pres-avis.component';
import { Socket } from 'ngx-socket-io';
import { UpdatePrixComponent } from './../update-prix/update-prix.component';
import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit } from '@angular/core';
import { ContratService } from 'src/app/services/contrat.service';
import { UserService } from 'src/app/services/user.service';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-contrat',
  templateUrl: './list-contrat.component.html',
  styleUrls: ['./list-contrat.component.css']
})
export class ListContratComponent implements OnInit {
  contrats: Contrat[] = [];
  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private contratService: ContratService, private userService: UserService, public print: PrintService, private dialog: MatDialog, private socket: Socket, private router: Router) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
    this.getContrats();
    this.socket.on('contrat_emit', () => {
      this.getContrats(); 
     });
    
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getContrats(){
    this.contratService.getContrats().subscribe(res => {
      this.contrats = res;
    })
  }

  /**
   * Exécute le traitement associé à la méthode « whatPost ». 
   */
  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onUpdatePrix ». 
   */
  onUpdatePrix(contrat: any){
    this.dialog.open(UpdatePrixComponent, {
      width: '500px',
      data:{contrat: contrat}
    })
  }

  /**
   * Ajoute ou crée l’élément demandé.
   */
  addPresAvis(contrat: any){
    this.dialog.open(AddPresAvisComponent, {
      width: '550px',
      data: {contrat: contrat},
    })
  }

  /**
   * Ajoute ou crée l’élément demandé.
   */
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

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getTypeContrat(type){
    if(type == 0){
      return 'Mensuel';
    }else if(type == 1){
      return 'Journalier';
    }else if(type == 2){
      return 'Pas de suivie';
    }
  }

  /**
   * Exécute le traitement associé à la méthode « jnp ». 
   */
  jnp(contrat: any): any{
    var i = 0;
    var diffDays = 0;
    var heure = 0;
    var hours = 0;
    var diffDays_verifie = 0;
    var jnp: any = null;
    var payement: any = null;
    var response_status = '';
    i = contrat.payements.length;
    payement = contrat.payements[i-1];
    var date = new Date();
  
    var end_date = new Date(payement.end_date);

    if(date > end_date){
      var diff = Math.abs(date.getTime() - end_date.getTime());
      heure = Math.abs(date.getTime() - end_date.getTime()) / 3600000;
      hours = date.getTime() - end_date.getTime();
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    }else{
      var diff = Math.abs(date.getTime() - end_date.getTime());
      heure = 0;

      hours = date.getTime() - end_date.getTime();
      var diffDays_verifie = Math.ceil(diff / (1000 * 3600 * 24)); 
    }

  
    var sec = hours / 1000 + '';
      var seconds = parseInt(sec, 10);

    var days = Math.floor(seconds / (3600*24));
    seconds  -= days*3600*24;
    var hrs   = Math.floor(seconds / 3600);
    seconds  -= hrs*3600;
    var mnts = Math.floor(seconds / 60);
    seconds  -= mnts*60;
    if(days >=0){
      jnp = days+" jours, "+hrs+" Hrs, "+mnts+" Min";
    }else{
      jnp = "0 jours";
    }

    

    if(diffDays > 0){
      response_status = 'danger text-white';
    }else{
      response_status = '';
      if(diffDays_verifie <= 2){
        response_status = 'warning text-white';
      }
      
    }

    var object = {
      "response_status": response_status,
      "diffDays": diffDays,
      "jnp": jnp,
      "heure": heure,
    }
    
    return object;
  }

  /**
   * Exécute le traitement associé à la méthode « test ». 
   */
  test(contrat: any): any{
    var i = 0;
    var month_verifie = 0;
    var payement: any = null;
    var response_status = '';
    i = contrat.payements.length;
    payement = contrat.payements[i-1];
    var date = new Date();
  
    var date_demo = new Date(payement?.year+'-'+payement?.month+'-'+28);
    
    month_verifie = this.monthDiff(date_demo, date);

    if(month_verifie <= 0){
      response_status = '';
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

  /**
   * Exécute le traitement associé à la méthode « stopContrat ». 
   */
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
        
        if(this.jnp(contrat).heure <= 10){
          this.dialog.open(StopContratComponent, {
            width: '550px',
            data: {contrat: contrat},
          })
        }else{
          Swal.fire("Impossible", this.jnp(contrat).heure.toFixed(2) + " heures c'est écouler vous devez payer le jour", "warning");
        }
      } 
    });
  }

  /**
   * Exécute le traitement associé à la méthode « redirectRoutes ». 
   */
  redirectRoutes(route: any){
    this.router.navigate([route]);
  }

  /**
   * Exécute le traitement associé à la méthode « monthDiff ». 
   */
  monthDiff(d1: any, d2: any) { var months; months = (d2.getFullYear() - d1.getFullYear()) * 12; months -= d1.getMonth(); months += d2.getMonth(); return months <= 0 ? 0 : months; }
}
