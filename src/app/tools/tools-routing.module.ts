// Table de routage du module "tools" (chargé en lazy loading depuis app-routing.module.ts).
// Route unique et minimale menant au composant conteneur ToolsComponent.
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolsComponent } from './tools.component';

const routes: Routes = [{ path: '', component: ToolsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule { }
