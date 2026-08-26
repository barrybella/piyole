import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrintService } from 'src/app/services/print.service';
import { AddChantierComponent } from '../add-chantier/add-chantier.component';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ContratService } from 'src/app/services/contrat.service';
import { UserService } from 'src/app/services/user.service';
import { LoginChantierComponent } from 'src/app/users/login-chantier/login-chantier.component';

@Component({
  selector: 'app-chantiers',
  templateUrl: './chantiers.component.html',
  styleUrls: ['./chantiers.component.css']
})
export class ChantiersComponent implements OnInit {
  contrats: any[] = [];

  constructor(public print: PrintService, private dialog: MatDialog, private loadingBar: LoadingBarService, private contratService: ContratService, public userService: UserService) { }

  ngOnInit(): void {
    if(this.userService.isLoggedIn()){
      this.getContratsSuivieChantier();
    }
  }

  formatText(text: string): string {
    return text.replace(/###\s*(.*?)(\n|$)/g, '<h4 style="font-size: 20px; ">$1</h4><br>').replace(/%%%\s*(.*?)(\n|$)/g, '<h5 style="font-size: 20px; ">$1</h5><br>').replace(/&&&\s*(.*?)(\n|$)/g, '<i style="font-size: 20px; ">$1</i><br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  getContratsSuivieChantier(){
    this.loadingBar.start();
    this.contratService.getContratsSuivieChantier().subscribe(res => {
      this.contrats = res;
      this.loadingBar.complete();
    })
  }

  onAddChantier(){
    if(this.userService.isLoggedIn()){
      this.dialog.open(AddChantierComponent, {
        width: '600px'
      })
    }else{
      this.dialog.open(LoginChantierComponent, {
        width: '500px'
      })
    }
    
  }
}
