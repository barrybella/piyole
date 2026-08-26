import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Composant de boîte de dialogue simple affichant un texte complet non tronqué
// (voir print.service.ts, méthode voirPlus, qui ouvre cette boîte de dialogue avec
// le texte complet passé en donnée).
@Component({
  selector: 'app-voir-plus',
  templateUrl: './voir-plus.component.html',
  styleUrls: ['./voir-plus.component.css']
})
export class VoirPlusComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VoirPlusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  // Méthode ngOnInit : gère la logique métier associée à cette opération.
  ngOnInit(): void {
  }

}
