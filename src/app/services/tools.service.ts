import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from './../backend';
import { Injectable } from '@angular/core';

// Service regroupant divers appels utilitaires : données géographiques (communes,
// quartiers), catégories de produits/annonces, contact et gestion de suppression/restauration.
@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  api = `${baseUrl}tools`;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private http: HttpClient) { }

  // Récupère la liste de tous les quartiers disponibles.
  public getQuartiers(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getQuartiers`).pipe(
      retry(3),      
    )
  }

  // Retourne le nombre total de quartiers enregistrés.
  public countQuartiers(): Observable<any>{
    return this.http.get<any>(`${this.api}/countQuartiers`).pipe(
      retry(3),      
    )
  }

  // Envoie un message de contact (formulaire "nous contacter").
  public addContact(contact: any): Observable<any>{
    return this.http.post<any>(`${this.api}/addContact`, contact).pipe(
      retry(3),      
    )
  }

  // Récupère la liste des catégories de produits de la boutique.
  public getCatProduits(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getCatProduits`).pipe(
      retry(3),      
    )
  }

  // Récupère la liste des communes disponibles.
  public getCommunes(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getCommunes`).pipe(
      retry(3),      
    )
  }

  // Récupère les quartiers appartenant à une commune donnée.
  public getQuartiersByCommune(commune: any): Observable<any>{
    return this.http.get<any>(`${this.api}/getQuartiersByCommune/${commune}`).pipe(
      retry(3),      
    )
  }

  // Supprime (probablement de façon logique/soft-delete) un élément par son identifiant.
  public onDelete(id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/onDelete/${id}`).pipe(
      retry(3),      
    )
  }

  // Restaure un élément précédemment supprimé (sortie de la corbeille).
  public onRestore(id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/onRestore/${id}`).pipe(
      retry(3),      
    )
  }

  // Enregistre un "besoin" exprimé par un utilisateur (ex. recherche non satisfaite).
  public addBesoin(value: any): Observable<any>{
    return this.http.post<any>(`${this.api}/addBesoin`, value).pipe(
      retry(3),      
    )
  }

  // Récupère la liste des catégories générales (annonces immobilières, etc.).
  public getCategories(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getCategories`).pipe(
      retry(3),      
    )
  }

}
