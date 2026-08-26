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

@Component({
  selector: 'app-raport-construction-for-invest',
  templateUrl: './raport-construction-for-invest.component.html',
  styleUrls: ['./raport-construction-for-invest.component.css']
})
export class RaportConstructionForInvestComponent implements OnInit {
  raports: any;
  constructor(private js: JsService,  private location: Location, private route: ActivatedRoute, private contratService: ContratService, private dialog: MatDialog, private socket: Socket, private _snackBar: SnackBarService) { }

  ngOnInit(): void {
    // this.js.jsRaportConstruction();
    this.getRaports();
    // this.socket.on('raportEmit', () => {
    //   this.getRaports();
    //  })
  }

  getRaports(){
    const id = this.route.snapshot.paramMap.get('contrat_id');
    this.contratService.getRaportsForInvest(id).subscribe(res => {
      this.raports = res;
      console.log("RAPORTS ", this.raports);
      
    })
  }

  onBack(){
    this.location.back();
  }

  onUpdate(result: any){
    this.dialog.open(UpdateRaportComponent, {
      width: '600px',
      data: {result: result}
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
        this._snackBar.openSnackBar("Suppresion en cours...", '')
        this.contratService.deleteRaport(result.contrat_id, result._id).subscribe(res => {
          Swal.fire("Suprimé", "Suppresion reuisse avec succès!!", "success");
        })
      }
    })
  }
}
