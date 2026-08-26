import  Swal from 'sweetalert2';
import { Contrat } from './../../interfaces/contrat';
import { VoirPlusComponent } from 'src/app/voir-plus/voir-plus.component';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-liste-versement-agence',
  templateUrl: './liste-versement-agence.component.html',
  styleUrls: ['./liste-versement-agence.component.css']
})
export class ListeVersementAgenceComponent implements OnInit {
  versements: any[] = [];
  contrat?: Contrat;
  p: number = 1;
  mont_total: number = 0;
  // dtOptions: DataTables.Settings = {};

  constructor(public dialogRef: MatDialogRef<ListeVersementAgenceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public print: PrintService, private dialog: MatDialog) { }

  ngOnInit(): void {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 5,
    //   lengthMenu: [5, 15, 25],
    //   processing: true
    // };

    this.contrat = this.data.contrat;
    this.versements = this.data.contrat.agence_versements.filter((resp: any) => {
      return resp.status == 0;
    });

    this.versements.forEach(resp => {
      this.mont_total = (+resp.montant) + (+this.mont_total);
    })

  }

  onVoirPlus(text: any){
    this.dialog.open(VoirPlusComponent, {
      data: {text: text},
      width: '500px'
    })
  }

  // onUpdate(versement: any){
  //   this.dialog.open(UpdateVersementAgenceComponent, {
  //     width: '500px',
  //     data: {versement: versement, contrat: this.contrat}
  //   })
  // }

  // onDelete(versement: any){
  //   Swal.fire({
  //     title: 'Es-tu sûr?',
  //     text: "Vous ête entrain d'annuler cet depot!!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Oui, declinez-le !',
  //     cancelButtonText: 'Annuler'
  //   }).then((result: any) => {
  //     if (result.isConfirmed) {
  //       this.dialog.open(DeleteVersementAgenceComponent, {
  //         width: '500px',
  //         data: {versement: versement, contrat: this.contrat}
  //       })
  //     }
  //   })
  // }
}
