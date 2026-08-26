import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';

// Composant réutilisable (partagé, voir shared.module.ts) affichant une grille de
// produits, avec des placeholders de chargement pour version bureau et mobile.
@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.css']
})
export class ShowProductsComponent implements OnInit {
  @Input() shops: any[] = [];
  @Input() chimer: boolean = false;

  chimers: any[] = ['', '', '', '','', ''];
  chimers_mobile: any[] = ['', '', ''];

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(public print: PrintService, private router: Router) { }

  ngOnInit(): void {
  }

  // Navigue vers la page de détail du produit sélectionné.
  onDetail(id: any){
    this.router.navigate(['shops/detail-product', id])
  }

  // Convertit une syntaxe de mise en forme personnalisée (balises ###, %%%, &&&,
  // **gras**) en HTML, pour afficher une description de produit enrichie sans
  // stocker directement du HTML brut en base de données.
  formatText(text: string): string {
    return text.replace(/###\s*(.*?)(\n|$)/g, '<h4 style="font-size: 20px; ">$1</h4><br>').replace(/%%%\s*(.*?)(\n|$)/g, '<h5 style="font-size: 20px; ">$1</h5><br>').replace(/&&&\s*(.*?)(\n|$)/g, '<i style="font-size: 20px; ">$1</i><br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }
}
