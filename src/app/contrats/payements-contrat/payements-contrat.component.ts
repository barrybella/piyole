import { RemovePayementJournalierComponent } from './../remove-payement-journalier/remove-payement-journalier.component';
import  Swal from 'sweetalert2';
import { RemovePayementComponent } from './../remove-payement/remove-payement.component';
import { RenouvellementContratJournalierComponent } from './../renouvellement-contrat-journalier/renouvellement-contrat-journalier.component';
import { Socket } from 'ngx-socket-io';
import { AddPayementComponent } from './../add-payement/add-payement.component';
import { MatDialog } from '@angular/material/dialog';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContratService } from 'src/app/services/contrat.service';
import { PrintService } from 'src/app/services/print.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payements-contrat',
  templateUrl: './payements-contrat.component.html',
  styleUrls: ['./payements-contrat.component.css']
})
export class PayementsContratComponent implements OnInit {
  contrat?: Contrat;
  year_tab_now?: any;
  year_iter?: any = 0;

  is_iter?: boolean = false;

  iters: any[] = [];

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private contratService: ContratService, private route: ActivatedRoute, private dialog: MatDialog, private socket: Socket, public print: PrintService, private location: Location) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
    var date = new Date();
    this.year_tab_now = date.getFullYear();
    this.getContrat();
    this.socket.on('contratEmit', () => {
      this.is_iter = true;
      this.getContrat();
    })
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getContrat(){
    const id = this.route.snapshot.paramMap.get('id');
    this.contratService.getContrat(id).subscribe(res => {
      this.contrat = res;
      if(!this.is_iter){
        this.year_iter = this.contrat.payements[0].year;
        var year_attribute = 0;
        for(var i=0; i< 9; i++){
          year_attribute = 2022 + i; 
          if(+this.year_iter <= (+year_attribute)){
            this.iters.push(year_attribute);
            
          }
        }
      }
    })
  }

  /**
   * Exécute le traitement associé à la méthode « payement ». 
   */
  payement(month: number, year: number) {
    var date = new Date();
    var trouve = false;
    var monthNow = date.getMonth() + 1;
    var yearNow = date.getFullYear();
    
    var color = '';
    this.contrat?.payements.forEach((resp: any) => {
      if(resp.month == month && resp.year == year && resp.status == 0) {
        trouve = true;
        color = 'success'; 
      }else if (resp.month == month && resp.year == year && month == monthNow && year == yearNow && resp.status == 1){
        trouve = true;
        color = 'warning';
      }else if(month < monthNow && year <= yearNow && resp.status == 1){
        color = 'danger';
      }
    });

    if(month == monthNow && year == yearNow && !trouve && !this.isNotContrat(month, year)){
      color = 'warning';
    }else if(month < monthNow && year <= yearNow && (month >= this.contrat?.payements[0].month && year >= this.contrat?.payements[0].year) && !trouve){
      color = 'danger';
    }else if(month < this.contrat?.payements[0].month && year <= this.contrat?.payements[0].year && !trouve){
      color = 'light';
    }else if(year <= yearNow && !trouve){
      color = 'danger';
    }
    
    return color;
  }

  /**
   * Exécute le traitement associé à la méthode « onAddPay ». 
   */
  onAddPay(month: number, year: number){
    this.dialog.open(AddPayementComponent, {
      data: {month: month, year: year, contrat: this.contrat},
      width: '400px'
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onRemovePay ». 
   */
  onRemovePay(month: number, year: number){
    this.dialog.open(RemovePayementComponent, {
      data: {month: month, year: year, contrat: this.contrat},
      width: '400px'
    })
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getMontnant(month: number, year: number){
    var montant = 0;
    var trouve = false;
    this.contrat?.payements.forEach((elem: any) => {
      if(elem.month == month && elem.year == year && elem.status == 0){
        montant = elem.montant;
        trouve = true;
      }
    });

    if(!trouve){
      montant =  0;
    }

    return montant;
  }

  /**
   * Exécute le traitement associé à la méthode « isNotContrat ». 
   */
  isNotContrat(month: number, year: number){
    var trouve = false;
    if(this.contrat?.payements[0].month > month && this.contrat?.payements[0].year >= year){
      trouve = true;
    }

    return trouve;
  }

  /**
   * Exécute le traitement associé à la méthode « isPresAvisOrStopContrat ». 
   */
  isPresAvisOrStopContrat(month: number, year: number){
    var trouve = false;

    var date1 = new Date(year, month - 1, 28);
    var date2: any;
    
    if(this.contrat?.date_fin_pres_avis){
       date2 = new Date(this.contrat?.date_fin_pres_avis);
    }else{
      var date2 = null;
    }

    
    if(date1 > date2 && date2 && (this.contrat?.status == 2 || this.contrat?.status == 1 || this.contrat?.status == 3 || this.contrat?.status == 4)){
        trouve = true;
    }else{
      trouve = false;
    }

    return trouve;
  }

  /**
   * Exécute le traitement associé à la méthode « canPay ». 
   */
  canPay(month: number, year: number){
    var month_prev = 0;
    if(month == 1){
      month_prev = 12
    }else{
      month_prev = month - 1;
    }
    var i = 0;
    i = this.contrat?.payements.length;

    var trouve = false;
    if(month > 1){
      if(!this.isNotContrat(month_prev, year)){
        this.contrat?.payements.forEach((res: any) => {
          if((+res.month) == (+month_prev) && year == res.year && res.status == 0){
            trouve = true;
          }
        })
      }else{
        trouve = true;
      }
    }else{
      if(this.contrat?.payements[0].month == month && this.contrat?.payements[0].year == year && this.contrat?.payements[0].status == 1 || this.contrat?.payements[i-1].month == month_prev && this.contrat?.payements[i-1].year == (year - 1)){
        trouve = true;
      }
    }

    return trouve;
  }

  /**
   * Exécute le traitement associé à la méthode « onBack ». 
   */
  onBack(){
    this.location.back();
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getProgressBar(month: number, year: number){
    var date = new Date(); 

    if(month == date.getMonth() + 1 && year == date.getFullYear()){
      return 'progress-bar-animated progress-bar-striped'
    }else {
      return ''
    }
  }

   /**
    * Exécute le traitement associé à la méthode « daysInMonth ». 
    */
   daysInMonth (month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getDayNumber(month: number, year: number) {
    var date = new Date();
    var monthNow = date.getMonth() + 1;
    var yearNow = date.getFullYear();
    var dayNow = date.getDate();
    var days = 0;

    if(month == monthNow && year == yearNow){
      days = dayNow;
    }else if(month < monthNow && year <= yearNow ){ // && (month >= this.contrat?.payements[0].month && year >= this.contrat?.payements[0].year)
      days = this.daysInMonth(month, year);
    }else if(year < yearNow ){
      days = this.daysInMonth(month, year);
    }else{
      days = 0;
    }

    return days
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getPurcentageProgressBar(month: number, year: number) {
    var date = new Date();
    var monthNow = date.getMonth() + 1;
    var yearNow = date.getFullYear();
    var dayNow = date.getDate();
    var days = 0;
    var totalDays = this.daysInMonth(month, year);
    var purcent = 0;

    if(month == monthNow && year == yearNow){
      days = dayNow;
      purcent = (days * 100)/totalDays;
    }else if(month < monthNow && year <= yearNow ){ //&& (month >= this.contrat?.payements[0].month && year >= this.contrat?.payements[0].year)
      days = this.daysInMonth(month, year);
      purcent = (days * 100)/totalDays;
    }else if(year < yearNow){
      days = this.daysInMonth(month, year);
      purcent = 100;  
      
    }else{
      days = 0;
      purcent = 0;
    }

    return Math.round(purcent);
  }

  /**
   * Exécute le traitement associé à la méthode « datteDifff ». 
   */
  datteDifff(start: any){
    let date1: Date = new Date(start);
    let date2: Date = new Date();
    let timeInMilisec: number = date2.getTime() - date1.getTime();
    var diffDays_verifie = Math.ceil(timeInMilisec / (1000 * 3600 * 24)); 
    if(diffDays_verifie < 0){
      return 0;
    }
    
    return diffDays_verifie;
    
  }

  /**
   * Exécute le traitement associé à la méthode « isRemove ». 
   */
  isRemove(month: any, year: any){
    var i = 0;
    var payement = null;

    i = this.contrat?.payements.length;
    payement = this.contrat?.payements[i-1];

    var date1 = new Date(payement.date);
    var date2 = new Date();

    var diff = Math.abs(date2.getTime() - date1.getTime()) / 3600000;

    
    if(payement.month == month && payement.year == year){
        if(payement.status == 0 && diff < 48000000000){
            return true
        }else{
            return false
        }
    }else{
        return false;
    }
  }


  /**
   * Exécute le traitement associé à la méthode « isRemoveJournalier ». 
   */
  isRemoveJournalier(item: any){
    var i = 0;
    var payement = null;

    i = this.contrat?.payements.length;
    payement = this.contrat?.payements[i-1];

    var date1 = new Date(payement.date);
    var date2 = new Date();

    var diff = Math.abs(date2.getTime() - date1.getTime()) / 3600000;

    
        if(i > 1 && diff < 480000000000 && item._id == payement._id){
            return true
        }else{
            return false
        }
    
  }

  /**
   * Exécute le traitement associé à la méthode « onRemoveJournalier ». 
   */
  onRemoveJournalier(item: any){
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
        this.dialog.open(RemovePayementJournalierComponent, {
          width: '550px',
          data: {contrat: this.contrat, item: item},
        })
      } 
    });
  }

  /**
   * Exécute le traitement associé à la méthode « progressBar ». 
   */
  progressBar(dayNow: any, endDay: any){
    var purcent = (dayNow * 100)/endDay;
    return purcent;
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getColorProgress(purcent: any, renouvel: any): any{
    if(purcent < 40){
      return 'success';
    }else if((purcent >= 40 && purcent < 75) && !renouvel){
      return 'warning'
    }else if((purcent >= 75 && purcent < 100) && !renouvel){
      return 'danger';
    }else if(purcent >= 100 && renouvel == true){
      return 'success'
    }else if(purcent >= 100 && !renouvel){
      return 'danger'
    }else if((purcent >= 40 && purcent < 75) && renouvel == true){
      return 'success'
    }else if((purcent >= 75 && purcent < 100) && renouvel == true){
      return 'success';
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getTime(date: any){
    var heure = new Date(date).getHours();
    var minute = new Date(date).getMinutes();
    return heure + 'h ' + minute ;
  }

  /**
   * Exécute le traitement associé à la méthode « onRenouvelement ». 
   */
  onRenouvelement(contrat: any, payement: any){
    var day_rep = 0;
    var dayDiffResponse = this.datteDifff(payement.start_date) - payement.day
    var dayDiff =  dayDiffResponse;
    if(dayDiff > 0){
      day_rep = dayDiff;
    }
    
    this.dialog.open(RenouvellementContratJournalierComponent, {
      data: {day_rep: day_rep, contrat: contrat, payement: payement},
      width: '500px'
    })
  }
}
