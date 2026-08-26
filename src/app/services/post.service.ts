import { retry } from 'rxjs/operators';
import { Post } from './../interfaces/post';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from './../backend';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// (avec corbeille/restauration), recherche multicritère (commune, quartier, catégorie,
// prix), pagination/défilement infini, gestion des contacts/devis/entretiens, et upload
// de médias (images, vidéos, PDF).
@Injectable({
  providedIn: 'root'
})
export class PostService {
  api = `${baseUrl}posts`;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private http: HttpClient) { }

  // Crée une nouvelle annonce.
  public addPost(post: Post): Observable<Post>{
    return this.http.post<Post>(`${this.api}/addPost`, post).pipe(
      retry(3),      
    )
  }  

  // Récupère la liste de toutes les annonces.
  public getPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPosts`).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces mises en avant sur la page d'accueil.
  public getPostsHomes(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsHomes`).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces de type "plan" (terrain à construire) pour la page d'accueil.
  public getPostsForPlanHomes(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsForPlanHomes`).pipe(
      retry(3),      
    )
  }

  // Récupère toutes les annonces à louer ou à vendre, avec pagination.
  public getAllPostRentSale(params: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getAllPostRentSale`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère toutes les annonces de type plan, avec pagination.
  public getAllPostPlans(params: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getAllPostPlans`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère toutes les annonces de type plan, version web, avec pagination.
  public getAllPostPlansWeb(params: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getAllPostPlansWeb`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère toutes les annonces de terrains, avec pagination.
  public getAllPostTerrains(params: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getAllPostTerrains`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces destinées aux ingénieurs (suivi de construction), avec pagination.
  public getPostIngs(params: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostIngs`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces à louer, avec pagination.
  public getPostsRent(params: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsRent`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces à vendre, avec pagination.
  public getPostsSales(params: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsSales`, { params }).pipe(
      retry(3),      
    )
  }

  // Retourne le nombre total d'annonces de vente et de location.
  public countPostVenteAndLocation(): Observable<any>{
    return this.http.get<any>(`${this.api}/countPostVenteAndLocation`).pipe(
      retry(3),      
    )
  }

  // Récupère les contacts en attente de confirmation pour l'utilisateur connecté.
  public getContactAttenteUser(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getContactAttenteUser`).pipe(
      retry(3),      
    )
  }

  // Récupère les contacts déjà confirmés pour l'utilisateur connecté.
  public getContactConfirmUser(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getContactConfirmUser`).pipe(
      retry(3),      
    )
  }

  // Retourne le nombre total d'annonces de type plan.
  public countPostPlans(): Observable<any>{
    return this.http.get<any>(`${this.api}/countPostPlans`).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces à louer, avec une limite optionnelle (par défaut très élevée,
  // ce qui revient en pratique à récupérer toutes les annonces).
  public getPostsForRent(limit: number = 100000000): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsForRent/${limit}`).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces les plus récentes, avec pagination.
  public getPostsRecent(params: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsRecent`, { params }).pipe(
      retry(3),      
    )
  }

  //     retry(3),      
  //   )

  //     retry(3),      
  //   )

  // Récupère les annonces d'une catégorie donnée, avec une limite optionnelle.
  public getPostsByCategory(categorie: string, limit: number = 1000000000): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsByCategory/${categorie}/${limit}`).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces disponibles pour investissement, avec une limite optionnelle.
  public getPostsForInvest(limit: number = 1000000000): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsForInvest/${limit}`).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces à vendre, avec une limite optionnelle.
  public getPostsForSale(limit: number = 100000000): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsForSale/${limit}`).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces de type plan, avec une limite optionnelle.
  public getPostsForPlan(limit: number = 100000000): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsForPlan/${limit}`).pipe(
      retry(3),      
    )
  }

  // Récupère une annonce complète par son identifiant.
  public getPost(id: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/getPost/${id}`).pipe(
      retry(3),      
    )
  }

  // Récupère uniquement les détails d'une annonce (sans les données annexes).
  public getPostDetailOnly(id: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/getPostDetailOnly/${id}`).pipe(
      retry(3),      
    )
  }

  // Récupère une annonce par son identifiant (variante).
  public getPostById(id: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/getPostById/${id}`).pipe(
      retry(3),      
    )
  }

  // Recherche une annonce par un identifiant/critère de recherche (usage mobile probable).
  public cherchPost(id: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/cherchPost/${id}`).pipe(
      retry(3),      
    )
  }

  // Recherche une annonce par un identifiant/critère de recherche, version web.
  public cherchPostWeb(id: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/cherchPostWeb/${id}`).pipe(
      retry(3),      
    )
  }

  // Recherche des annonces selon plusieurs critères combinés : commune, quartier,
  public getPostToCherch(commune: string, quartier: string, type: number, categorie: string, min: number, max: number, params: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostToCherch/${commune}/${quartier}/${type}/${categorie}/${min}/${max}`, { params }).pipe(
      retry(3),      
    )
  }

  // Recherche des annonces selon les mêmes critères, mais explicitement hors de la
  // fourchette de prix donnée (résultats alternatifs/élargis).
  public getPostsResultNotBetweenPrix(commune: string, quartier: string, type: number, categorie: string, min: number, max: number): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsResultNotBetweenPrix/${commune}/${quartier}/${type}/${categorie}/${min}/${max}`).pipe(
      retry(3),      
    )
  }

  // Recherche des annonces par commune, quartier, catégorie et type (location ou vente).
  public getPostsByCommuneQuartierCategorieRentOrSale(categorie: any, commune: any, quartier: any, type: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsByCommuneQuartierCategorieRentOrSale/${categorie}/${commune}/${quartier}/${type}`).pipe(
      retry(3),      
    )
  }

  // Restaure une annonce précédemment supprimée (sortie de la corbeille).
  public restorePost(id: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/restorePost/${id}`).pipe(
      retry(3),      
    )
  }

  // Récupère toutes les annonces publiées par un utilisateur donné.
  public getPostsByUser(id: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsByUser/${id}`).pipe(
      retry(3),      
    )
  }
  // Récupère les annonces supprimées (corbeille) d'un utilisateur donné.
  public getPostsDeletedByUser(id: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsDeletedByUser/${id}`).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces actives (non supprimées) d'un utilisateur donné.
  public getPostsActiveByUser(id: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsActiveByUser/${id}`).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces actives d'un utilisateur via son slug (URL conviviale), avec pagination.
  public getPostsActiveByUserSlug(slug: any, params: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsActiveByUserSlug/${slug}`, { params }).pipe(
      retry(3),      
    )
  }

  // Met à jour une annonce existante.
  public updatePost(id: any, post: Post): Observable<Post>{
    return this.http.put<Post>(`${this.api}/updatePost/${id}`, post).pipe(
      retry(3),      
    )
  } 

  // Supprime une annonce (probablement de façon logique, vers la corbeille).
  public deletePost(id: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/deletePost/${id}`).pipe(
      retry(3),      
    )
  } 

  // Retourne le nombre total d'annonces.
  public countAllPost(): Observable<any>{
    return this.http.get<any>(`${this.api}/countAllPost`).pipe(
      retry(3),      
    )
  } 

  // Retourne le nombre d'annonces regroupées par région.
  public countPostByRegion(): Observable<any>{
    return this.http.get<any>(`${this.api}/countPostByRegion`).pipe(
      retry(3),      
    )
  } 

  // Retourne le nombre de contacts en attente pour l'utilisateur connecté.
  public countContactAttenteUser(): Observable<any>{
    return this.http.get<any>(`${this.api}/countContactAttenteUser`).pipe(
      retry(3),      
    )
  } 

  // Recherche des annonces par commune, quartier et catégorie, avec pagination optionnelle.
  public getPostsByCommuneQuartierCategorie(categorie: any, commune: any, quartier: any, params?: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsByCommuneQuartierCategorie/${categorie}/${commune}/${quartier}`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces regroupées par quartier, pour une catégorie/commune donnée.
  public getQuartierByGroup(categorie: any, commune: any, quartier: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getQuartierByGroup/${categorie}/${commune}/${quartier}`).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces d'une ville/région donnée, avec pagination.
  public getPostsByVille(region: any, params: any): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/getPostsByVille/${region}`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces à louer pour une catégorie donnée, avec pagination.
  public getPostsByCategoryForRent(categorie: any, params: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsByCategoryForRent/${categorie}`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces à vendre pour une catégorie donnée, avec une limite optionnelle.
  public getPostsByCategoryForSale(categorie: any, limit: number = 1000000000): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsByCategoryForSale/${categorie}/${limit}`).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces de type plan pour une catégorie donnée, avec une limite optionnelle.
  public getPostsByCategoryForPlan(categorie: any, limit: number = 1000000000): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsByCategoryForPlan/${categorie}/${limit}`).pipe(
      retry(3),      
    )
  }

  // Vérifie si un contact (par téléphone) existe déjà pour une annonce donnée.
  public testIfContactForPostByIdAndTel(id: any, tel: any): Observable<any>{
    return this.http.get<any>(`${this.api}/testIfContactForPostByIdAndTel/${id}/${tel}`).pipe(
      retry(3),      
    )
  }

  // Ajoute/associe un contact à une annonce (ex. demande d'information sur un bien).
  public setContactPost(id: any, contact: any): Observable<Post>{
    return this.http.put<Post>(`${this.api}/setContactPost/${id}`, contact).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces présentes dans la corbeille.
  public getTrashPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getTrashPosts`).pipe(
      retry(3),      
    )
  }

  // Associe un devis à une annonce.
  public setDevis(id: any, devie: any): Observable<Post>{
    return this.http.put<Post>(`${this.api}/setDevis/${id}`, devie).pipe(
      retry(3),      
    )
  }

  // Met à jour la vidéo associée à une annonce.
  public updateVideo(id: any, value: any): Observable<Post>{
    return this.http.put<Post>(`${this.api}/updateVideo/${id}`, value).pipe(
      retry(3),      
    )
  }

  // Met à jour la vidéo associée à une annonce, version mobile.
  public updateVideoMobile(id: any, value: any): Observable<Post>{
    return this.http.put<Post>(`${this.api}/updateVideoMobile/${id}`, value).pipe(
      retry(3),      
    )
  }

  // Refuse/rejette une demande de contact sur une annonce.
  public declineContact(post_id: any, contact_id: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/declineContact/${post_id}/${contact_id}`).pipe(
      retry(3),      
    )
  }

  // Confirme une demande de contact sur une annonce.
  public confirmContact(post_id: any, contact_id: any, post: Post): Observable<Post>{
    return this.http.put<Post>(`${this.api}/confirmContact/${post_id}/${contact_id}`, post).pipe(
      retry(3),      
    )
  }

  // Récupère une annonce par son identifiant (variante utilisée dans un contexte précis).
  public getPostByPostId(postId: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/getPostByPostId/${postId}`).pipe(
      retry(3),      
    )
  }

  // Supprime la vidéo associée à une annonce.
  public deleteVideo(id: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/deleteVideo/${id}`).pipe(
      retry(3),      
    )
  }

  // Supprime le PDF associé à une annonce.
  public deletePdf(id: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/deletePdf/${id}`).pipe(
      retry(3),      
    )
  }

  // Retourne le nombre d'annonces pour une catégorie donnée.
  public countPostsByCategory(categorie: any): Observable<any>{
    return this.http.get<any>(`${this.api}/countPostsByCategory/${categorie}`).pipe(
      retry(3),      
    )
  }

  // Retourne le nombre d'annonces regroupées par catégorie.
  public getCountCategorie(): Observable<any>{
    return this.http.get<any>(`${this.api}/getCountCategorie`).pipe(
      retry(3),      
    )
  }

  // Retourne le nombre d'annonces de location.
  public countPostLocation(): Observable<any>{
    return this.http.get<any>(`${this.api}/countPostLocation`).pipe(
      retry(3),      
    )
  }

  //     retry(3),      
  //   )

  // Supprime un devis associé à une annonce.
  public deleteDevi(post_id: any, devi_id: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/deleteDevi/${post_id}/${devi_id}`).pipe(
      retry(3),      
    )
  }

  // Ajoute une demande d'entretien (ex. visite du bien) liée à une annonce et un contact.
  public addEntretien(post_id: any, contact_id: any, post: Post): Observable<Post>{
    return this.http.put<Post>(`${this.api}/addEntretien/${post_id}/${contact_id}`, post).pipe(
      retry(3),      
    )
  }

  // Associe un contact provenant d'un résultat de recherche à une annonce.
  public setContactFromResultCherechByPostId(id: any, contact: any): Observable<Post>{
    return this.http.put<Post>(`${this.api}/setContactFromResultCherechByPostId/${id}`, contact).pipe(
      retry(3),      
    )
  }

  // Ajoute un investissement à une annonce (contexte investissement/construction).
  public addInvest(id: any, invest: any): Observable<Post>{
    return this.http.put<Post>(`${this.api}/addInvest/${id}`, invest).pipe(
      retry(3),      
    )
  }

  // Met à jour le prix d'une annonce.
  public updatePriced(id: any, value: any): Observable<Post>{
    return this.http.put<Post>(`${this.api}/updatePriced/${id}`, value).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces d'une catégorie donnée avec pagination/défilement infini.
  public getPostsByCategoryScrolings(categorie: any, params: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/getPostsByCategoryScrolings/${categorie}`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère les annonces de type plan d'une catégorie donnée avec pagination/défilement infini.
  public getPostsByCategoryPlanScrolings(categorie: any, params: any): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.api}/getPostsByCategoryPlanScrolings/${categorie}`, { params }).pipe(
      retry(3),      
    )
  }

  // Récupère un lot d'annonces pour le défilement infini générique (toutes catégories confondues).
  public infinitScrol(params: any): Observable<Post>{
    return this.http.get<Post>(`${this.api}/infinitScrol`, { params }).pipe(
      retry(3),      
    )
  }

  // Téléverse une image liée à une annonce.
  public upload(data) {
    return this.http.post<any>(`${this.api}/avatar`, data, {
   
    }).pipe(
      retry(3),
    );
  }

  // Téléverse une vidéo liée à une annonce.
  public uploadVideo(data) {
    return this.http.post<any>(`${this.api}/video`, data, {
   
    }).pipe(
      retry(3),
    );
  }

  // Téléverse un fichier PDF lié à une annonce.
  public uploadPdf(data) {
    return this.http.post<any>(`${this.api}/pdf`, data, {
   
    }).pipe(
      retry(3),
    );
  }
}
