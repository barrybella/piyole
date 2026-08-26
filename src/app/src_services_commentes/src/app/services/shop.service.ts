import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../backend';
import { Observable, retry } from 'rxjs';

// Service de gestion des boutiques et de leurs produits : création, mise à jour,
// suppression (avec corbeille/restauration), pagination et récupération pour affichage.
@Injectable({
  providedIn: 'root'
})
export class ShopService {
  api = `${baseUrl}shops`;

  constructor(private http: HttpClient) { }

  // Ajoute un nouveau produit à une boutique.
  public addProduct(contact: any): Observable<any>{
    return this.http.post<any>(`${this.api}/addProduct`, contact).pipe(
      retry(3),      
    )
  }

  // Récupère une boutique complète par son identifiant.
  public getShopById(id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/getShopById/${id}`).pipe(
      retry(3),      
    )
  }

  // Récupère un produit précis par son identifiant.
  public getProduct(id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/getProduct/${id}`).pipe(
      retry(3),      
    )
  }

  // Récupère uniquement les informations générales d'une boutique (sans ses produits).
  public getShopDetailOnly(id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/getShopDetailOnly/${id}`).pipe(
      retry(3),      
    )
  }

  // Récupère les produits d'une catégorie donnée avec pagination/défilement infini.
  public getProductByCategoryScrolings(categorie: any, params: any): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getProductByCategoryScrolings/${categorie}`, { params }).pipe(
      retry(3),      
    )
  }

  // Supprime un produit (probablement en le déplaçant vers une corbeille logique).
  public deleteProduct(id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/deleteProduct/${id}`).pipe(
      retry(3),      
    )
  }

  // Met à jour les informations générales d'une boutique.
  public updateShop(id: any, shop: any): Observable<any>{
    return this.http.put<any>(`${this.api}/updateShop/${id}`, shop).pipe(
      retry(3),      
    )
  }

  // Ajoute un détail (ex. variante, caractéristique) à une boutique.
  public addDetails(id: any, shop: any): Observable<any>{
    return this.http.put<any>(`${this.api}/addDetails/${id}`, shop).pipe(
      retry(3),      
    )
  }

  // Met à jour un détail existant d'une boutique.
  public updateDetails(id: any, detail_id: any, shop: any): Observable<any>{
    return this.http.put<any>(`${this.api}/updateDetails/${id}/${detail_id}`, shop).pipe(
      retry(3),      
    )
  }

  // Supprime un détail précis d'une boutique.
  public deleteDetails(id: any, detail_id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/deleteDetails/${id}/${detail_id}`).pipe(
      retry(3),      
    )
  }

  // Définit/met à jour les catégories associées à une boutique.
  public setCats(categories: any): Observable<any>{
    return this.http.post<any>(`${this.api}/setCats`, categories).pipe(
      retry(3),      
    )
  }

  // Récupère tous les produits avec pagination classique (page/limite).
  public getAllProductsByPaginations(params: any): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getAllProductsByPaginations`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère les boutiques d'une catégorie donnée avec pagination/défilement infini.
  public getShopsByCategoryScrolings(categorie: any, params: any): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getShopsByCategoryScrolings/${categorie}`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère les boutiques à afficher dans le contexte des annonces (posts).
  public getShopForPost(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getShopForPost`).pipe(
      retry(3),      
    )
  }

  // Récupère les boutiques placées dans la corbeille (supprimées logiquement).
  public getCorbeilShops(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getCorbeilShops`).pipe(
      retry(3),      
    )
  }

  // Récupère les boutiques mises en avant sur la page d'accueil.
  public getShopHome(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getShopHome`).pipe(
      retry(3),      
    )
  }

  // Récupère l'ensemble des produits.
  public getProducts(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getProducts`).pipe(
      retry(3),      
    )
  }

  // Récupère les catégories groupées avec le nombre de produits par catégorie.
  public getCategorieGroupAndCountNumber(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getCategorieGroupAndCountNumber`).pipe(
      retry(3),      
    )
  }

  // Retourne le nombre total de produits enregistrés.
  public countProducts(): Observable<any>{
    return this.http.get<any>(`${this.api}/countProducts`).pipe(
      retry(3),      
    )
  }

  // Récupère les boutiques les plus récentes, avec pagination.
  public getShopRecents(params: any): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getShopRecents`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère des boutiques/produits recommandés.
  public getRec(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getRec`).pipe(
      retry(3),      
    )
  }

  // Téléverse une image d'avatar/logo pour une boutique.
  public upload(data) {
    return this.http.post<any>(`${this.api}/avatar`, data, {
   
    }).pipe(
      retry(3),
    );
  }
}
