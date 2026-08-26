import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../backend';
import { Observable, retry } from 'rxjs';

// suivi de l'état de livraison, paiement et récupération des commandes de l'utilisateur.
@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  api = `${baseUrl}commandes`;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private http: HttpClient) { }

  // Crée une nouvelle commande. Réessaie automatiquement 3 fois en cas d'échec réseau.
  public addCommande(commande: any): Observable<any>{
    return this.http.post<any>(`${this.api}/addCommande`, commande).pipe(
      retry(3),      
    )
  }

  // Met à jour l'état de livraison d'une commande existante (ex. en cours, livrée).
  public setEtatLivraison(id: any, commande: any): Observable<any>{
    return this.http.put<any>(`${this.api}/setEtatLivraison/${id}`, commande).pipe(
      retry(3),      
    )
  }

  // Marque une commande comme payée.
  public onPayCommande(id: any, commande: any): Observable<any>{
    return this.http.put<any>(`${this.api}/onPayCommande/${id}`, commande).pipe(
      retry(3),      
    )
  }

  // Indique qu'une commande a été prise en charge pour la livraison.
  public onPriseEnChargeLiv(id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/onPriseEnChargeLiv/${id}`).pipe(
      retry(3),      
    )
  }

  // Annule la prise en charge d'une commande pour la livraison.
  public onNotPriseEnChargeLiv(id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/onNotPriseEnChargeLiv/${id}`).pipe(
      retry(3),      
    )
  }

  // Récupère toutes les commandes de l'utilisateur connecté (côté vendeur/gestion).
  public getMyCommandes(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getMyCommandes`).pipe(
      retry(3),      
    )
  }

  // Récupère les commandes de l'utilisateur connecté depuis son espace client.
  public getMyCommandesClientPanel(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getMyCommandesClientPanel`).pipe(
      retry(3),      
    )
  }
}
