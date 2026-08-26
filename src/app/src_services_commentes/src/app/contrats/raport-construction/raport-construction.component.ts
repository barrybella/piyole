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
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { JsService } from './../../services/js.service';
import { Component, OnInit } from '@angular/core';
import { AddRaportVideoMobileComponent } from '../add-raport-video-mobile/add-raport-video-mobile.component';

@Component({
  selector: 'app-raport-construction',
  templateUrl: './raport-construction.component.html',
  styleUrls: ['./raport-construction.component.css']
})
export class RaportConstructionComponent implements OnInit {
  raports?: any;
  contrat?: Contrat;
  constructor(private js: JsService,  private location: Location, private route: ActivatedRoute, private contratService: ContratService, private dialog: MatDialog, private socket: Socket, private _snackBar: SnackBarService, public print: PrintService, public userService: UserService) { }

  ngOnInit(): void {
    // this.js.jsRaportConstruction();
    this.getRaports();
    this.socket.on('raportEmit', () => {
      this.getRaports();
     })
  }

  getRaports(){
    const id = this.route.snapshot.paramMap.get('contrat_id');
    this.contratService.getContratForAgence(id).subscribe(res => {
      this.contrat = res;
    });

    // if(this.userService.getUserDetails()?.role == 'user' && this.userService.getUserDetails()?.agence == true){
    //   this.contratService.getRaportsAgence(id).subscribe(res => {
    //     this.raports = res;
    //   });
    // }else{
    //   this.contratService.getRaports(id).subscribe(res => {
    //     this.raports = res;
    //   });
    // }

    this.contratService.getRaports(id).subscribe(res => {
      this.raports = res;
      console.log("MES RAPPORTS ", this.raports);
      
    });
  }

  onBack(){
    this.location.back();
  }

  onUpdate(result: any){
    this.dialog.open(UpdateRaportComponent, {
      width: '600px',
      data: {result: result, contrat: this.contrat},
      disableClose: true
    })
  }

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
        // this._snackBar.openSnackBar("Suppresion en cours...", '')
        // this.contratService.deleteRaport(result.contrat_id, result._id).subscribe(res => {
        //   Swal.fire("Suprimé", "Suppresion reuisse avec succès!!", "success");
        // })

        this.dialog.open(DeleteRaportComponent, {
          width: '600px',
          data: {result: result, contrat: this.contrat}
        })
      }
    })
  }

  onAddRaport(){
    this.dialog.open(AddRaportComponent, {
      width: '600px',
      data: {contrat: this.contrat},
      disableClose: true
    })
  }

  onAddRaportVideo(){
    this.dialog.open(AddRaportVideoComponent, {
      width: '600px',
      data: {contrat: this.contrat},
      disableClose: true
    })
  }

  onAddRaportVideoMobile(){
    this.dialog.open(AddRaportVideoMobileComponent, {
      width: '600px',
      data: {contrat: this.contrat},
      disableClose: true
    })
  }
}
