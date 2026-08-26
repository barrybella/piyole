import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// Service utilitaire pour afficher des notifications courtes (snack bars) à l'utilisateur,
// par exemple pour confirmer une action ou signaler une erreur.
@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private _snackBar: MatSnackBar) { }

  // Affiche une notification standard, visible pendant 5 secondes.
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  // Affiche une notification longue durée (40 secondes), utilisée pour les opérations
  // plus lentes comme l'envoi de vidéos, afin de laisser le temps à l'utilisateur de la lire.
  uploadVideoOpenSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 40000,
    });
  }
}
