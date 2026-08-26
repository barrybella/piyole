import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';


// Module utilitaire qui regroupe et ré-exporte les modules Angular Material utilisés
// dans l'application (boîtes de dialogue et notifications), pour éviter de les importer
// individuellement partout où ils sont nécessaires.
@NgModule({
  exports: [
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class DemoMaterialModule {}


/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */