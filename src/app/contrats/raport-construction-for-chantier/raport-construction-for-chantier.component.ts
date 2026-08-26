import { AddRaportVideoComponent } from './../add-raport-video/add-raport-video.component';
import { UserService } from 'src/app/services/user.service';
import { DeleteRaportComponent } from './../delete-raport/delete-raport.component';
import { PrintService } from 'src/app/services/print.service';
import { Contrat } from './../../interfaces/contrat';
import { AddRaportComponent } from './../add-raport/add-raport.component';
import { SnackBarService } from './../../services/snack-bar.service';
import  Swal from 'sweetalert2';
import { Socket } from 'ngx-socket-io';
import { UpdateRaportComponent } from './../update-raport/update-raport.component';
import { MatDialog } from '@angular/material/dialog';
import { ContratService } from 'src/app/services/contrat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { JsService } from './../../services/js.service';
import { Component, OnInit } from '@angular/core';
import { AddRaportVideoMobileComponent } from '../add-raport-video-mobile/add-raport-video-mobile.component';
import { AddRaportForChantierComponent } from '../add-raport-for-chantier/add-raport-for-chantier.component';
import { AddRaportVideoForChantierComponent } from '../add-raport-video-for-chantier/add-raport-video-for-chantier.component';
import { Subscription, timer } from 'rxjs';
import { UpdateRaportChantierComponent } from '../update-raport-chantier/update-raport-chantier.component';
import { ViewImagesComponent } from '../view-images/view-images.component';

@Component({
  selector: 'app-raport-construction-for-chantier',
  templateUrl: './raport-construction-for-chantier.component.html',
  styleUrls: ['./raport-construction-for-chantier.component.css']
})
export class RaportConstructionForChantierComponent implements OnInit {
  raports?: any;
  contrat?: any;
  action: boolean = false;
  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private js: JsService,  private location: Location, private route: ActivatedRoute, private contratService: ContratService, private dialog: MatDialog, private socket: Socket, private _snackBar: SnackBarService, public print: PrintService, public userService: UserService, private router: Router) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {

      this.getRaports();
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getRaports(){
    const id = this.route.snapshot.paramMap.get('contrat_id');
    this.contratService.getContratById(id).subscribe(res => {
      this.contrat = res;
      this.contrat?.participants.forEach(elem => {
        if(elem.status == 1 && elem.delete == 0 && elem.user_id == this.userService.getUserDetails()._id){
          this.action = true;
        }
      })
    });

    this.contratService.getRaports(id).subscribe(res => {
      this.raports = res;
      
    });
  }

  /**
   * Exécute le traitement associé à la méthode « viewImages ». 
   */
  viewImages(image: any){
    this.dialog.open(ViewImagesComponent,{
      width: '700px',
      maxHeight: '700px',
      data:{
        "image": image
      }
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onBack ». 
   */
  onBack(){
    this.location.back();
  }

  /**
   * Exécute le traitement associé à la méthode « formatText ». 
   */
  formatText(text: string): string {
    return text.replace(/###\s*(.*?)(\n|$)/g, '<h4 style="font-size: 20px; ">$1</h4><br>').replace(/%%%\s*(.*?)(\n|$)/g, '<h5 style="font-size: 20px; ">$1</h5><br>').replace(/&&&\s*(.*?)(\n|$)/g, '<i style="font-size: 20px; ">$1</i><br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  /**
   * Exécute le traitement associé à la méthode « onUpdate ». 
   */
  onUpdate(result: any){
    this.dialog.open(UpdateRaportChantierComponent, {
      width: '600px',
      data: {result: result, contrat: this.contrat},
      disableClose: true
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onDelete ». 
   */
  onDelete(result: any){
    Swal.fire({
      title: 'Es-tu sûr?',
      text: "Vous pourrez plus revenir en arriere!!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, declinez-le !',
      cancelButtonText: 'Annuler'
    }).then((resp) => {
      if (resp.isConfirmed) {

        this.dialog.open(DeleteRaportComponent, {
          width: '600px',
          data: {result: result, contrat: this.contrat}
        })
      }
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onAddRaport ». 
   */
  onAddRaport(){
    this.dialog.open(AddRaportForChantierComponent, {
      width: '600px',
      data: {contrat: this.contrat},
      disableClose: true
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onAddRaportVideo ». 
   */
  onAddRaportVideo(){
    this.dialog.open(AddRaportVideoForChantierComponent, {
      width: '600px',
      data: {contrat: this.contrat},
      disableClose: true
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onAddRaportVideoMobile ». 
   */
  onAddRaportVideoMobile(){
    this.dialog.open(AddRaportVideoMobileComponent, {
      width: '600px',
      data: {contrat: this.contrat},
      disableClose: true
    })
  }

}
