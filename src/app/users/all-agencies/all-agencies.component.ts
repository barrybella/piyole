import { PrintService } from 'src/app/services/print.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { Component, OnInit } from '@angular/core';

// Page listant toutes les agences certifiées (vérifiées), avec un tableau de
// placeholders (chimers) affiché pendant le chargement des données.
@Component({
  selector: 'app-all-agencies',
  templateUrl: './all-agencies.component.html',
  styleUrls: ['./all-agencies.component.css']
})
export class AllAgenciesComponent implements OnInit {
  users: User[] = [];
  chimers: any[] = ['', '', '', '', '', ''];
  chimer?: boolean = true;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private userService: UserService, private router: Router, public print: PrintService) { }

  ngOnInit(): void {
    this.getUserCertificates();
  }

  // Récupère la liste des agences disposant d'un certificat (vérifiées).
  getUserCertificates(){
    this.userService.getUserCertificates().subscribe(res => {
      this.users = res;
      this.chimer = false;
    })
  }

  // Navigue vers la page publique de l'agence via son slug (URL conviviale).
  onRedirect(slug: any){
    this.router.navigate(['', slug])
  }
}
