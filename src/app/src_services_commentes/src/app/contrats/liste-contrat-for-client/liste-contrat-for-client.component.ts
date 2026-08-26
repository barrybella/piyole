import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit } from '@angular/core';
import { ContratService } from 'src/app/services/contrat.service';
import { UserService } from 'src/app/services/user.service';
import { PrintService } from 'src/app/services/print.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-liste-contrat-for-client',
  templateUrl: './liste-contrat-for-client.component.html',
  styleUrls: ['./liste-contrat-for-client.component.css']
})
export class ListeContratForClientComponent implements OnInit {
  contrats: Contrat[] = [];
  constructor(private contratService: ContratService, private userService: UserService, public print: PrintService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getContratForLocationsAndVentes();
  }

  getContratForLocationsAndVentes(){
    this.contratService.getContratForLocationsAndVentes().subscribe(res => {
      this.contrats = res;
    })
  }

  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
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
}
