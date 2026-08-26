import { baseUrl } from './../backend';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { TokenResponse } from '../interfaces/token';

// Service central de gestion des utilisateurs : authentification (inscription, connexion,
// déconnexion), gestion du token JWT, profil, panier, et opérations administratives
// (liste des utilisateurs, agences, fournisseurs, etc.).
@Injectable({
  providedIn: 'root'
})
export class UserService {
  api = `${baseUrl}users`;
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  // Sauvegarde le token JWT à la fois en mémoire et dans le localStorage du navigateur.
  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  // Récupère le profil de l'utilisateur actuellement connecté.
  public profile(): Observable<any>{
    return this.http.get<any>(`${this.api}/profile`).pipe(
      retry(3),      
    )
  }

  // Retourne le token JWT courant, en le récupérant depuis le localStorage
  // s'il n'est pas déjà en mémoire (ex. après un rafraîchissement de page).
  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  // Déconnecte l'utilisateur : efface le token en mémoire et dans le localStorage,
  // puis redirige vers la page d'accueil.
  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigate(['/home']);
  }

  // Décode le token JWT (sans vérification de signature, juste décodage base64 du
  // payload) pour en extraire les informations de l'utilisateur connecté.
  public getUserDetails(): User {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  // Vérifie si l'utilisateur est connecté en comparant la date d'expiration du token
  // (contenue dans son payload) à l'heure actuelle.
  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  // Inscrit un nouvel utilisateur et sauvegarde automatiquement le token reçu.
  public register(user: any): Observable<any>{
    return this.http.post<any>(`${this.api}/register`, user).pipe(
      retry(3),
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
  }
  
  // Connecte un utilisateur (mobile/app) et sauvegarde automatiquement le token reçu.
  public login(user: any): Observable<any>{
    return this.http.post<any>(`${this.api}/login`, user).pipe(
      retry(3),
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      }) 
    )
  }
  
  // Connecte un utilisateur depuis la version web et sauvegarde automatiquement le token reçu.
  public loginWeb(user: any): Observable<any>{
    return this.http.post<any>(`${this.api}/loginWeb`, user).pipe(
      retry(3),
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      }) 
    )
  }

  // Vérifie le mot de passe pour confirmer une action sensible avant de continuer.
  public confirmPasswordLogin(user: any): Observable<any>{
    return this.http.post<any>(`${this.api}/confirmPasswordLogin`, user).pipe(
      retry(3),
    )
  }

  // Ajoute un utilisateur (probablement depuis un contexte administratif).
  public addUtilisateur(user: User): Observable<User>{
    return this.http.post<User>(`${this.api}/addUtilisateur`, user).pipe(
      retry(3),
    );
  }

  // Vérifie si un numéro de téléphone est déjà utilisé par un compte existant.
  public telExist(tel: any): Observable<any>{
    return this.http.get<any>(`${this.api}/telExist/${tel}`).pipe(
      retry(3),
    )
  }

  // Vérifie si un compte associé à cet email peut procéder à une réinitialisation
  // de mot de passe (ex. existence du compte, contraintes de sécurité).
  public testIfCanRenitialisedPassword(email: any): Observable<any>{
    return this.http.get<any>(`${this.api}/testIfCanRenitialisedPassword/${email}`).pipe(
      retry(3),
    )
  }

  // Récupère l'agence associée à un numéro de téléphone donné.
  public getAgence(tel: any): Observable<any>{
    return this.http.get<any>(`${this.api}/getAgence/${tel}`).pipe(
      retry(3),
    )
  }

  // Récupère un utilisateur par son identifiant.
  public getUserById(id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/getUser/${id}`).pipe(
      retry(3),
    )
  }

  // Récupère le panier d'achat d'un utilisateur donné.
  public getBasket(id: any): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getBasket/${id}`).pipe(
      retry(3),
    )
  }

  // Récupère un utilisateur (probablement une agence/boutique) via son slug (URL conviviale).
  public getUserBySlug(slug: any): Observable<any>{
    return this.http.get<any>(`${this.api}/getUserBySlug/${slug}`).pipe(
      retry(3),
    )
  }

  // Supprime un élément du panier par son identifiant.
  public deleteBasket(id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/deleteBasket/${id}`).pipe(
      retry(3),
    )
  }

  // Récupère le panier de l'utilisateur actuellement connecté (via son token).
  public getUserByIdBasket(): Observable<any>{
    return this.http.get<any>(`${this.api}/getUserByIdBasket`).pipe(
      retry(3),
    )
  }

  // Récupère la liste de tous les utilisateurs (vue administrative).
  public getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.api}/getAllUsers`).pipe(
      retry(3),
    )
  }

  // Récupère la liste des fournisseurs.
  public getFournisseurs(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getFournisseurs`).pipe(
      retry(3),
    )
  }

  // Retourne le nombre total d'agences enregistrées.
  public countAgences(): Observable<any>{
    return this.http.get<any>(`${this.api}/countAgences`).pipe(
      retry(3),
    )
  }

  // Retourne le nombre d'utilisateurs de type "client" uniquement (hors agences/fournisseurs).
  public countUserClientOnly(): Observable<any>{
    return this.http.get<any>(`${this.api}/countUserClientOnly`).pipe(
      retry(3),
    )
  }

  // Récupère la liste des utilisateurs disposant d'un certificat (agences vérifiées).
  public getUserCertificates(): Observable<User[]>{
    return this.http.get<User[]>(`${this.api}/getUserCertificates`).pipe(
      retry(3),
    )
  }

  // Met à jour les informations du profil de l'utilisateur connecté.
  public editProfil(user: any): Observable<User>{
    return this.http.put<User>(`${this.api}/editProfil`, user).pipe(
      retry(3),
    )
  }

  // Supprime définitivement le compte de l'utilisateur connecté.
  public deleteAccount(): Observable<any>{
    return this.http.get<any>(`${this.api}/deleteAccount`).pipe(
      retry(3),
    )
  }

  // Met à jour le mot de passe d'un utilisateur donné.
  public updatePassword(id: any, user: any): Observable<any>{
    return this.http.put<any>(`${this.api}/updatePassword/${id}`, user).pipe(
      retry(3),
    )
  }

  // Ajoute un article au panier.
  public addBasket(object: any): Observable<any>{
    return this.http.post<any>(`${this.api}/addBasket`, object).pipe(
      retry(3),      
    )
  }

  // Vérifie si un email est déjà associé à un compte existant.
  public emailExist(email: string): Observable<User>{
    return this.http.get<User>(`${this.api}/emailExist/${email}`).pipe(
      retry(3),
    )
  }

  // Téléverse une image de profil pour l'utilisateur.
  public uploadImage(data: any) {
    return this.http.post<any>(`${this.api}/add_image`, data, {
   
    }).pipe(
      retry(3),
    );
  }

  // Téléverse une image de carte d'identité/pièce justificative pour l'utilisateur.
  public uploadCarte(data: any) {
    return this.http.post<any>(`${this.api}/add_carte`, data, {
   
    }).pipe(
      retry(3),
    );
  }
}
