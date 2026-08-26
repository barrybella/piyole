import { Contrat } from './../interfaces/contrat';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { baseUrl } from '../backend';

// Service central de gestion des contrats : contrats de location (mensuels, journaliers),
// de vente et d'investissement/construction. Gère aussi les rapports de chantier, les
// paiements/règlements, les préavis, les résiliations et les participants aux contrats.
@Injectable({
  providedIn: 'root'
})
export class ContratService {
  api = `${baseUrl}contrats`;
  
  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private http: HttpClient) { }

  // Crée un nouveau contrat de location à partir d'une annonce et d'un contact.
  public addContrat(post_id: any, contact_id: any, contrat: any): Observable<any>{
    return this.http.put<any>(`${this.api}/addContrat/${post_id}/${contact_id}`, contrat).pipe(
      retry(3),      
    )
  } 

  // Ajoute un rapport de suivi de chantier à un contrat de construction.
  public addRaportForChantier(contrat_id: any, raport: any): Observable<any>{
    return this.http.put<any>(`${this.api}/addRaportForChantier/${contrat_id}`, raport).pipe(
      retry(3),      
    )
  } 

  // Ajoute un rapport générique à un contrat.
  public addRaport(contrat_id: any, raport: any): Observable<any>{
    return this.http.put<any>(`${this.api}/addRaport/${contrat_id}`, raport).pipe(
      retry(3),      
    )
  } 

  // Récupère la liste des contrats de vente.
  public getContratVentes(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratVentes`).pipe(
      retry(3),      
    )
  }

  // Ajoute un rapport destiné aux investisseurs d'un contrat de construction/investissement.
  public addRaportForInvest(contrat_id: any, raport: any): Observable<any>{
    return this.http.put<any>(`${this.api}/addRaportForInvest/${contrat_id}`, raport).pipe(
      retry(3),      
    )
  } 
  
  // Enregistre le renouvellement (paiement) d'un contrat de location journalière.
  public renouvelementContratJournalier(contrat_id: any, payement_id: any, value: any): Observable<any>{
    return this.http.put<any>(`${this.api}/renouvelementContratJournalier/${contrat_id}/${payement_id}`, value).pipe(
      retry(3),      
    )
  } 

  // Crée un nouveau contrat de vente à partir d'une annonce et d'un contact.
  public addContratForSale(post_id: any, contact_id: any, contrat: any): Observable<any>{
    return this.http.put<any>(`${this.api}/addContratForSale/${post_id}/${contact_id}`, contrat).pipe(
      retry(3),      
    )
  }  

  // Récupère l'état de règlement (paiement) d'un contrat pour un mois/une année donnés.
  public reglement(contrat_id: any, month: any, year: any): Observable<any>{
    return this.http.get<any>(`${this.api}/reglement/${contrat_id}/${month}/${year}`).pipe(
      retry(3),      
    )
  }  

  // Ajoute un préavis (de départ/résiliation) à un contrat.
  public addPresAvis(contrat_id: any, value: any): Observable<any>{
    return this.http.put<any>(`${this.api}/addPresAvis/${contrat_id}`, value).pipe(
      retry(3),
    )
  } 
  
  // Récupère un contrat complet par son identifiant.
  public getContratById(contrat_id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/getContratById/${contrat_id}`).pipe(
      retry(3),      
    )
  }
  
  // Récupère la liste de tous les contrats.
  public getContrats(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContrats`).pipe(
      retry(3),      
    )
  }
  
  // Récupère la liste des contrats résiliés.
  public getContratResilier(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratResilier`).pipe(
      retry(3),      
    )
  } 

  // Annule/retire un règlement (paiement) précédemment enregistré pour un contrat journalier.
  public removeReglementJournalier(contrat_id: any, payement_id: any): Observable<Contrat>{
    return this.http.get<Contrat>(`${this.api}/removeReglementJournalier/${contrat_id}/${payement_id}`).pipe(
      retry(3),      
    )
  } 

  // Récupère les contrats pour lesquels un préavis a été demandé (par le locataire).
  public getPresAvisDemmander(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getPresAvisDemmander`).pipe(
      retry(3),      
    )
  } 

  // Récupère la liste des contrats stoppés/interrompus.
  public getContratStoper(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratStoper`).pipe(
      retry(3),      
    )
  } 
  
  // Récupère les contrats pour lesquels un préavis a été donné (par l'agence/propriétaire).
  public getPresAvisDonner(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getPresAvisDonner`).pipe(
      retry(3),      
    )
  } 

  // Ajoute une demande de résiliation à un contrat.
  public addResiliation(contrat_id: any, value: any): Observable<any>{
    return this.http.put<any>(`${this.api}/addResiliation/${contrat_id}`, value).pipe(
      retry(3),      
    )
  }

  // Stoppe/interrompt un contrat en cours.
  public stopContrat(contrat_id: any, value: any): Observable<any>{
    return this.http.put<any>(`${this.api}/stopContrat/${contrat_id}`, value).pipe(
      retry(3),      
    )
  }

  // Récupère les contrats de construction/investissement en cours (vue ingénieur).
  public getIngForConstructInvest(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getIngForConstructInvest`).pipe(
      retry(3),      
    )
  }  
  
  // Récupère les contrats regroupant à la fois les locations et les ventes.
  public getContratForLocationsAndVentes(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratForLocationsAndVentes`).pipe(
      retry(3),      
    )
  }  
  
  // Récupère les contrats d'investissement propres à l'investisseur connecté.
  public getContratsForInvestsByInvestisseur(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratsForInvestsByInvestisseur`).pipe(
      retry(3),      
    )
  }  
  
  // Récupère un contrat par son identifiant (vue générale/agence).
  public getContrat(id: any): Observable<Contrat>{
    return this.http.get<Contrat>(`${this.api}/getContrat/${id}`).pipe(
      retry(3),      
    )
  }  
  
  // Récupère un contrat par son identifiant, du point de vue du client.
  public getContratForClient(id: any): Observable<Contrat>{
    return this.http.get<Contrat>(`${this.api}/getContratForClient/${id}`).pipe(
      retry(3),      
    )
  }  

  // Annule/retire un règlement (paiement) pour un mois/une année donnés.
  public removeReglement(contrat_id: any, month: any, year: any): Observable<any>{
    return this.http.get<any>(`${this.api}/removeReglement/${contrat_id}/${month}/${year}`).pipe(
      retry(3),      
    )
  }

  // Récupère la liste des contrats de location mensuelle.
  public getContratMensuels(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratMensuels`).pipe(
      retry(3),      
    )
  } 

  // Récupère les contrats de vente du point de vue du client.
  public getContratVentesClient(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratVentesClient`).pipe(
      retry(3),      
    )
  } 

  // Récupère les contrats de location journalière du point de vue du client.
  public getContratJournaliersForClient(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratJournaliersForClient`).pipe(
      retry(3),      
    )
  } 

  // Variante de récupération des contrats journaliers client, spécifique à Piyole
  // (probablement une règle métier ou un format de réponse différent).
  public getContratJournaliersForClient_Piyole(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratJournaliersForClient_Piyole`).pipe(
      retry(3),      
    )
  } 

  // Récupère les contrats de location mensuelle du point de vue du client.
  public getContratMensuelsForClient(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratMensuelsForClient`).pipe(
      retry(3),      
    )
  } 

  // Récupère la liste des contrats de location journalière (vue agence).
  public getContratJournaliers(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratJournaliers`).pipe(
      retry(3),      
    )
  } 

  // Récupère le contrat associé à une annonce, si un préavis a été déposé sur celui-ci.
  public getContratByPostIdIfPresAvis(post_id: any): Observable<Contrat>{
    return this.http.get<Contrat>(`${this.api}/getContratByPostIdIfPresAvis/${post_id}`).pipe(
      retry(3),      
    )
  }

  // Met à jour le montant d'un contrat.
  public updateMontantContrat( contrat_id: any, contrat: any): Observable<any>{
    return this.http.put<any>(`${this.api}/updateMontantContrat/${contrat_id}`, contrat).pipe(
      retry(3),      
    )
  } 
  
  // Récupère un contrat du point de vue de l'agence.
  public getContratForAgence(id: any): Observable<Contrat>{
    return this.http.get<Contrat>(`${this.api}/getContratForAgence/${id}`).pipe(
      retry(3),      
    )
  }  
  
  // Récupère la liste des participants (co-investisseurs) associés à un contrat.
  public getParticipants(id: any): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getParticipants/${id}`).pipe(
      retry(3),      
    )
  }  
  
  // Retire un participant d'un contrat.
  public deleteParticipant(contrat_id: any, participant_id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/deleteParticipant/${contrat_id}/${participant_id}`).pipe(
      retry(3),      
    )
  }  

  // Met à jour les informations d'un participant sur un contrat.
  public updateParticipant(contrat_id: any, user_id: any, participant_id: any, obj: any): Observable<any>{
    return this.http.put<any>(`${this.api}/updateParticipant/${contrat_id}/${user_id}/${participant_id}`, obj).pipe(
      retry(3),      
    )
  }

  // Ajoute un nouveau participant (investisseur) à un contrat.
  public addParticipantInContrat(contrat_id: any, user_id: any, obj: any): Observable<any>{
    return this.http.put<any>(`${this.api}/addParticipantInContrat/${contrat_id}/${user_id}`, obj).pipe(
      retry(3),      
    )
  }
  
  // Met à jour un rapport existant d'un contrat.
  public updateRaport(contrat_id: any, raport_id: any, raport: any): Observable<any>{
    return this.http.put<any>(`${this.api}/updateRaport/${contrat_id}/${raport_id}`, raport).pipe(
      retry(3),      
    )
  }  

  // Ajoute une entrée de suivi (avancement) à un contrat de construction.
  public addSuivie(contrat: any): Observable<any>{
    return this.http.post<any>(`${this.api}/addSuivie`, contrat).pipe(
      retry(3),      
    )
  }  

  // Récupère les contrats avec leur suivi de chantier associé.
  public getContratsSuivieChantier(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getContratsSuivieChantier`).pipe(
      retry(3),      
    )
  } 
  
  // Supprime un rapport d'un contrat.
  public deleteRaport(contrat_id: any, raport_id: any): Observable<any>{
    return this.http.get<any>(`${this.api}/deleteRaport/${contrat_id}/${raport_id}`).pipe(
      retry(3),      
    )
  }  
  
  // Récupère tous les rapports associés à un contrat.
  public getRaports(contrat_id: any): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getRaports/${contrat_id}`).pipe(
      retry(3),      
    )
  }  
  
  // Récupère les rapports d'un contrat, du point de vue de l'agence.
  public getRaportsAgence(contrat_id: any): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getRaportsAgence/${contrat_id}`).pipe(
      retry(3),      
    )
  }  

  // Récupère les rapports d'un contrat destinés aux investisseurs.
  public getRaportsForInvest(contrat_id: any): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getRaportsForInvest/${contrat_id}`).pipe(
      retry(3),      
    )
  }  

  // Récupère les contrats liés à des plans (probablement des plans de construction/paiement).
  public getContratsForPlan(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratsForPlan`).pipe(
      retry(3),      
    )
  }  

  // Récupère les contrats liés à des plans, du point de vue de l'agence.
  public getContratsForPlanForAgence(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratsForPlanForAgence`).pipe(
      retry(3),      
    )
  }  

  // Récupère les contrats liés à des plans, du point de vue du client.
  public getContratsForPlanForClient(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratsForPlanForClient`).pipe(
      retry(3),      
    )
  }  

  // Récupère les contrats de construction, du point de vue de l'agence.
  public getContratsForConstructionForAgence(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratsForConstructionForAgence`).pipe(
      retry(3),      
    )
  }  

  // Récupère les contrats de construction, du point de vue du client.
  public getContratsForConstructionForClient(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratsForConstructionForClient`).pipe(
      retry(3),      
    )
  }  
  
  // Récupère la liste générale des contrats de construction.
  public getContratsForConstruction(): Observable<Contrat[]>{
    return this.http.get<Contrat[]>(`${this.api}/getContratsForConstruction`).pipe(
      retry(3),      
    )
  }

  // Téléverse une image (ex. photo de chantier) liée à un contrat.
  public upload(data) {
    return this.http.post<any>(`${this.api}/avatar`, data, {
   
    }).pipe(
      retry(3),
    );
  }

  // Téléverse une vidéo (ex. vidéo de suivi de chantier) liée à un contrat.
  public uploadVideo(data) {
    return this.http.post<any>(`${this.api}/video`, data, {
   
    }).pipe(
      retry(3),
    );
  }
}
