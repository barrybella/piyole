import { PrintService } from 'src/app/services/print.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-agencies',
  templateUrl: './all-agencies.component.html',
  styleUrls: ['./all-agencies.component.css']
})
export class AllAgenciesComponent implements OnInit {
  users: User[] = [];
  chimers: any[] = ['', '', '', '', '', ''];
  chimer?: boolean = true;

  constructor(private userService: UserService, private router: Router, public print: PrintService) { }

  ngOnInit(): void {
    this.getUserCertificates();
  }

  getUserCertificates(){
    this.userService.getUserCertificates().subscribe(res => {
      this.users = res;
      this.chimer = false;
    })
  }

  onRedirect(slug: any){
    this.router.navigate(['', slug])
  }
}
