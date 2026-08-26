import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Service simple dédié à la récupération de la liste des pays via une API publique externe.
@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = 'https://restcountries.com/v3.1/all'; // URL de l'API REST Countries

  constructor(private http: HttpClient) { }

  // Récupère la liste complète des pays depuis l'API REST Countries.
  // Utile pour peupler des listes déroulantes (ex. formulaires d'inscription/adresse).
  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
