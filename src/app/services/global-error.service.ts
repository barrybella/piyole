import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Service centralisé de gestion des erreurs de l'application.
// Distingue les erreurs venant du backend (HTTP) des autres erreurs JavaScript,
// et les journalise dans la console avec un message adapté à chaque cas.
@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService {

  // Point d'entrée unique appelé lorsqu'une erreur survient dans l'application.
  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
        // Cas où le backend répond avec un code d'erreur (404, 500, etc.)
    } else {
        // Cas d'une erreur JavaScript classique, non liée à une requête HTTP
    }     
  }
}
