import  Swal from 'sweetalert2';
import { Contrat } from './../../interfaces/contrat';
import { VoirPlusComponent } from 'src/app/voir-plus/voir-plus.component';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-liste-payement-client',
  templateUrl: './liste-payement-client.component.html',
  styleUrls: ['./liste-payement-client.component.css']
})
export class ListePayementClientComponent implements OnInit {
  versements: any[] = [];
  contrat?: Contrat;
  p: number = 1;
  mont_total: number = 0;
  // dtOptions: DataTables.Settings = {};

  constructor(public dialogRef: MatDialogRef<ListePayementClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public print: PrintService, private dialog: MatDialog) { }

  ngOnInit(): void {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 5,
    //   lengthMenu: [5, 15, 25],
    //   processing: true
    // };

    this.contrat = this.data.contrat;
    this.versements = this.data.contrat.construction_payements.filter((resp: any) => {
      return resp.status == 0;
    });

    this.versements.forEach(res => {
      this.mont_total = (+res.montant) + (+this.mont_total);
    })
    
  }

  onVoirPlus(text: any){
    this.dialog.open(VoirPlusComponent, {
      data: {text: text},
      width: '500px'
    })
  }

}
