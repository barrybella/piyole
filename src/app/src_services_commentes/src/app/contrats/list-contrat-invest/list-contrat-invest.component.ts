import { WhatPostComponent } from './../../posts/what-post/what-post.component';
import { PrintService } from './../../services/print.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './../../services/user.service';
import { ContratService } from './../../services/contrat.service';
import { Contrat } from './../../interfaces/contrat';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-contrat-invest',
  templateUrl: './list-contrat-invest.component.html',
  styleUrls: ['./list-contrat-invest.component.css']
})
export class ListContratInvestComponent implements OnInit {
  contrats: Contrat[] = [];
  constructor(private contratService: ContratService, private userService: UserService, private dialog: MatDialog, public print: PrintService) { }

  ngOnInit(): void {
    this.getContratsForInvests();
  }

  getContratsForInvests(){
    this.contratService.getContratsForInvestsByInvestisseur().subscribe(res => {
      this.contrats = res;
      console.log("CONTRATS ", this.contrats);

    })
  }

  whatPost(){
    this.dialog.open(WhatPostComponent, {
      width: '500px'
    })
  }
}
