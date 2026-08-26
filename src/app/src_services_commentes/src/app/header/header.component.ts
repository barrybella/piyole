import { Router } from '@angular/router';
import { CherchRefComponent } from './../posts/cherch-ref/cherch-ref.component';
import { MatDialog } from '@angular/material/dialog';
import { ScriptStoreHome } from './../services/dynamic-loader.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  activeStatus: boolean = false;
  ok?: boolean = false;
  user?: User;
  count_bask: number = 0;

  constructor(public userService: UserService, private dialog: MatDialog, private router: Router, private socket: Socket) { }

  ngOnInit() {
    this.getUser();
    this.socket.on('add_basket_event', () => {
      this.getUser();
    })
  }

  getUser(){
    this.ok = false;
    this.count_bask = 0;
      this.userService.getUserByIdBasket().subscribe(res => {
        this.user = res;
        this.user.baskets.forEach(resp => {
          if(resp.delete == 0 && resp.status == 0){
            this.count_bask++;
            this.ok = true;
          }
        })
      })
  }

  onDeconexion(){
    this.userService.logout();
  }

  onRedirect(route: any){
    this.router.navigate([route])
  }

  cherch(){
    this.dialog.open(CherchRefComponent, {
      width: '500px'
    })
  }
}
