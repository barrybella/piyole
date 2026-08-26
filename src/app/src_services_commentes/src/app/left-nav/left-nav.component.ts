import { Socket } from 'ngx-socket-io';
import { PrintService } from 'src/app/services/print.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { UpdatePasswordComponent } from '../update-password/update-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements OnInit {
  user?: any;
  contact_prise: number = 0;

  constructor(public userService: UserService, private router: Router, public print: PrintService, private socket: Socket, private postService: PostService, private dialog: MatDialog) { }
  
  ngOnInit() {
    this.getUser();
    this.countContactAttenteUser();
    this.socket.on('userList', () => {
      this.getUser(); 
     });

     this.socket.on('contacts', () => {
       this.countContactAttenteUser();
     });
  }

  getUser(){
    this.userService.getUserById(this.userService.getUserDetails()._id).subscribe(res => {
      this.user = res;
    })
  }

  countContactAttenteUser(){
    this.postService.countContactAttenteUser().subscribe(res => {
      this.contact_prise = res;
    });
  }

  getActive(route: any): any{
    if(route == this.router.url){
      return 'active';
    }
  }

  onRedirect(route: any){
    this.router.navigate([route]);
  }

  onDeconexion(){
    this.userService.logout();
  }

  onUpdatePassword(){
    this.dialog.open(UpdatePasswordComponent, {
      width: '400px'
    })
  }

}
