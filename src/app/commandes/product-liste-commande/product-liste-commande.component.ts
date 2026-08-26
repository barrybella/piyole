import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrintService } from 'src/app/services/print.service';

// Boîte de dialogue simple affichant la liste des produits contenus dans une commande
// (données transmises par le composant appelant, ex. order-list).
@Component({
  selector: 'app-product-liste-commande',
  templateUrl: './product-liste-commande.component.html',
  styleUrls: ['./product-liste-commande.component.css']
})
export class ProductListeCommandeComponent implements OnInit {
  products: any[] = [];

  constructor(public dialogRef: MatDialogRef<ProductListeCommandeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public print: PrintService) { }

  // Méthode ngOnInit : gère la logique métier associée à cette opération.
  ngOnInit(): void {
    this.products = this.data.products;
  }

}
