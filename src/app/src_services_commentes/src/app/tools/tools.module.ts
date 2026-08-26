import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolsRoutingModule } from './tools-routing.module';
import { ToolsComponent } from './tools.component';
import { AddBesoinComponent } from './add-besoin/add-besoin.component';
import { ReactiveFormsModule } from '@angular/forms';


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
