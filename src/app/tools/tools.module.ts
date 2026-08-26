import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolsRoutingModule } from './tools-routing.module';
import { ToolsComponent } from './tools.component';
import { AddBesoinComponent } from './add-besoin/add-besoin.component';
import { ReactiveFormsModule } from '@angular/forms';


// Module de fonctionnalité "tools" : regroupe le composant conteneur et le formulaire
// permettant à un visiteur d'exprimer un besoin (recherche non satisfaite par les
// annonces existantes).
@NgModule({
  declarations: [
    ToolsComponent,
    AddBesoinComponent
  ],
  imports: [
    CommonModule,
    ToolsRoutingModule,
    ReactiveFormsModule
  ]
})
export class ToolsModule { }
