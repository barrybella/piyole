import { LoadingBarService } from '@ngx-loading-bar/core';
import { Location } from '@angular/common';
import { Contrat } from './../../interfaces/contrat';
import { ContratService } from './../../services/contrat.service';
import { PrintService } from 'src/app/services/print.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-detail-contrat',
  templateUrl: './detail-contrat.component.html',
  styleUrls: ['./detail-contrat.component.css']
})
export class DetailContratComponent implements OnInit, OnDestroy {
  contrat?: any;
  date_now?: any;

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private route: ActivatedRoute, private contratService: ContratService, public print: PrintService, private location: Location, private loadingBar: LoadingBarService) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
    this.getContrat();
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getContrat(){
    this.loadingBar.start();
    const id = this.route.snapshot.paramMap.get('id');
    this.contratService.getContrat(id).subscribe(res => {
      this.contrat = res;
      this.loadingBar.complete();
    })
    this.date_now = new Date();

  }

  /**
   * Exécute le traitement associé à la méthode « monthDiff ». 
   */
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

 

  /**
   * Exécute le traitement associé à la méthode « onBack ». 
   */
  onBack(){
    this.location.back();
  }

  /**
   * Libère les ressources utilisées par le composant avant sa destruction.
   */
  ngOnDestroy(){
    this.loadingBar.complete();
  }
  
}
