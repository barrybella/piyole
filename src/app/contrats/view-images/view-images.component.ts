import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.css']
})
export class ViewImagesComponent implements OnInit {
  image?: any; 

  constructor(public dialogRef: MatDialogRef<ViewImagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public print: PrintService) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
    this.image = this.data.image;
  }

}
