import { baseUrl } from './../backend';
import { ToolsService } from './tools.service';
import { VoirPlusComponent } from './../voir-plus/voir-plus.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/compat/storage';
declare var require: any
const FileSaver = require('file-saver');
import { Observable } from 'rxjs';
// Service "utilitaire d'affichage" très riche : formate et traduit en texte lisible
// les codes numériques utilisés dans l'application (statuts de contrat, de livraison,
// phases de construction), génère les URLs d'images/vidéos S3, calcule des retards de
// paiement/préavis, affiche des notifications, et fournit divers formatages de texte.
@Injectable({
  providedIn: 'root'
})
export class PrintService {
  public categories: string[] = [];

  // Télécharge un fichier PDF (à partir de son chemin relatif) via le navigateur.
  pdf(file: any){
    const pdfUrl = `${baseUrl}${file}`;
    const pdfName = 'your_pdf_file';
    FileSaver.saveAs(pdfUrl, pdfName);
  }

  // Charge la liste des catégories depuis le backend dès la création du service,
  // pour qu'elles soient disponibles partout où ce service est injecté.
  constructor(private dialog: MatDialog, private toolsService: ToolsService, private storage: AngularFireStorage) { 
    this.toolsService.getCategories().subscribe(res => {
      this.categories = res;
    })
  }

  // Construit l'URL complète d'une image stockée sur S3, ou retourne une image
  // par défaut ("pas d'image") si aucune image n'est fournie.
  printImage(image: any)  {
    if(image){

      const bucketUrl = 'https://piyole-bucket.s3.amazonaws.com';
      return `${bucketUrl}/${image}`;
    }else{
      return '../assets/images/not-pic.png';
    }
  }

  // Construit l'URL complète d'une photo de profil stockée sur S3, ou retourne un
  // avatar par défaut si aucune image n'est fournie.
  printProfile(image: any){
    if(image){

      const bucketUrl = 'https://piyole-bucket.s3.amazonaws.com';
      return `${bucketUrl}/${image}`;
    }else{
      return '../assets/images/avatar.png';
    }
  }

  // Traduit le code numérique d'état de construction en libellé lisible.
  printEtatConstuction(value: any): any{
    if(value == 0 ){
      return 'En cours';
    }else if(value == 1){
      return 'En pause';
    }else if(value == 3){
      return 'Terminer';
    }else if(value == 2){
      return 'Annuler';
    }
  }

  // Traduit le code numérique de statut de contrat en libellé lisible.
  printStatusContrat(value: any): any{
    if(value == 0 ){
      return 'En cours';
    }else if(value == 1){
      return 'Près avis Demander';
    }else if(value == 2){
      return 'Près avis Donner';
    }else if(value == 3){
      return 'Contrat Resilier';
    }else if(value == 4){
      return 'Contrat Stoper';
    }
  }

  // Traduit le code numérique de phase de construction en libellé lisible.
  printPhase(value: any): any{
    if(value == 0 ){
      return 'Petit Oeuvres';
    }else if(value == 1){
      return 'Gros Oeuvres';
    }
  }

  // Construit l'URL complète d'une vidéo stockée sur S3.
  printVideo(video: any){
    
    if(video){
      const bucketUrl = 'https://piyole-bucket.s3.amazonaws.com';
      return `${bucketUrl}/${video}`;
    }
  }

  // Tronque un titre à une taille donnée et ajoute des points de suspension si nécessaire.
  printTitle(title: any, size: number = 20){
    if(title.length >= size){
      return title.slice(0, size) + '...';
    }
    return title;
  }

  // Tronque un texte à une taille donnée et indique si un bouton "voir plus" doit
  // être affiché (si le texte original dépassait la taille demandée).
  printDescription(text, size = 20){
    var alt: any = {};
    if(text.length >= size){
      alt = {
        "text": text.slice(0, size),
        "voirPlus": true
      }
      return alt;
    }
    alt = {
      "text": text.slice(0, size),
      "voirPlus": false
    }
    return alt;
  }

  // Concatène commune, quartier et secteur en une adresse lisible, tronquée si trop longue.
  printAdress(commune: any, quartier: any, secteur: any, size: number = 27){
    var concat =  commune + ', ' + quartier + ' ' + secteur;
    
    if(concat.length > size){
      return concat.slice(0, size) + '...';
    }
    return concat;
  }

  // Formate un prix numérique avec séparateurs de milliers pour l'affichage.
  printPrice(prix: any){
    var prix: any = +prix;
    if(prix) return Number((prix).toFixed(1)).toLocaleString();
    return 0;
  }

  // Traduit un booléen en "Oui"/"Non" pour l'affichage.
  printBoolean(bool: boolean){
    if(bool){
      return 'Oui';
    }else{
      return 'Non';
    }
  }

  // Formate une durée d'avance (en années ou en mois) en texte lisible, avec
  // gestion du pluriel pour les années.
  printPeriodeAvance(periode, temps){
    if(periode == 'An'){
      if(temps > 1 ){
        return temps + ' Ans ';
      }else{
        return temps + ' An ';
      }
    }else{
      return temps + ' Mois ';
    }
  }

  // Traduit le code numérique de type de suivi de chantier en libellé lisible.
  printSuivie(value: any): any{
    if(value == 0 ){
      return 'Suivis des travaux';
    }else if(value == 1){
      return 'Main d\'oeuvres et suivis';
    }else if(value == 2){
      return 'Achat matériaux, main d\'oeuvres et suivis';
    }
  }

  // Associe une couleur (classe CSS Bootstrap) au statut numérique d'un contrat,
  // pour un affichage visuel cohérent (badges, étiquettes).
  printStatusColorContrat(value: any): any{
    if(value == 0 ){
      return 'success';
    }else if(value == 1){
      return 'warning';
    }else if(value == 2){
      return 'warning';
    }else if(value == 3){
      return 'danger';
    }else if(value == 4){
      return 'danger';
    }
  }

  // Calcule le nombre de jours (et heures/minutes) écoulés depuis la fin de la
  // dernière période payée d'un contrat, pour signaler un retard de paiement.
  // Retourne aussi une classe CSS ("danger"/"warning") selon la gravité du retard.
  printDayNotPay(contrat: any): any{
    var i = 0;
    var diffDays = 0;
    var heure = 0;
    var hours = 0;
    var diffDays_verifie = 0;
    var jnp: any = null;
    var payement: any = null;
    var response_status = '';
    i = contrat.payements.length;
    payement = contrat.payements[i-1];
    var date = new Date();
  
    var end_date = new Date(payement.end_date);

    if(date > end_date){
      var diff = Math.abs(date.getTime() - end_date.getTime());
      heure = Math.abs(date.getTime() - end_date.getTime()) / 3600000;
      hours = date.getTime() - end_date.getTime();
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    }else{
      var diff = Math.abs(date.getTime() - end_date.getTime());
      heure = 0;

      hours = date.getTime() - end_date.getTime();
      var diffDays_verifie = Math.ceil(diff / (1000 * 3600 * 24)); 
    }

  
    var sec = hours / 1000 + '';
      var seconds = parseInt(sec, 10);

    var days = Math.floor(seconds / (3600*24));
    seconds  -= days*3600*24;
    var hrs   = Math.floor(seconds / 3600);
    seconds  -= hrs*3600;
    var mnts = Math.floor(seconds / 60);
    seconds  -= mnts*60;
    if(days >=0){
      jnp = days+" jours, "+hrs+" Hrs, "+mnts+" Min";
    }else{
      jnp = "0 jours";
    }

    

    if(diffDays > 0){
      response_status = 'danger text-white';
    }else{
      response_status = '';
      if(diffDays_verifie <= 2){
        response_status = 'warning text-white';
      }
      
    }

    var object = {
      "response_status": response_status,
      "diffDays": diffDays,
      "jnp": jnp,
      "heure": heure,
    }
    
    return object;
  }

  // Détermine le libellé du type de contrat (location mensuelle/journalière, vente,
  // vente de plan, construction) en fonction de ses différents champs de type.
  printTypeContrat(contrat: any): any{
    if(contrat?.type == 0 ){
      if(contrat?.loc_sale == 0){
        if(contrat?.type_contrat == 0){
          return 'Contrat Location Mensuel';
        }else if(contrat?.type_contrat == 1){
          return 'Contrat Location Journaliere';
        }
      }else if(contrat?.loc_sale == 1){
        return 'Contrat de Vente';
      }
      return 'En cours';
    }else if(contrat?.type  == 1){
      return 'Contrat de vente de plan';
    }else if(contrat?.type  == 2){
      return 'Contrat de constuction';
    }
  }

  // Traduit le code numérique de type d'annonce (location, vente, plan) en libellé lisible.
  getTypePost(type: any){
    if(type == 0 ){
      return 'Location';
    }else if(type == 1){
      return 'Vente';
    }else if(type == 2){
      return 'Plan'
    }
  }

  // Associe une couleur (classe CSS) au type d'annonce, pour l'affichage visuel.
  getTypePostColor(type: any){
    if(type == 0 ){
      return 'primary';
    }else if(type == 1){
      return 'secondary';
    }else if(type == 2){
      return 'info'
    }
  }

  // Traduit le booléen "actif" d'une annonce en libellé lisible ("Publié" ou "Verification").
  getActice(active: any){
    if(active){
      return 'Publié';
    }else{
      return 'Verification';
    }
  }

  // Traduit le code numérique d'état de livraison d'une commande en libellé lisible.
  getEtatLivraison(etat: any){
    if(etat == 0 ){
      return 'En Attente';
    }else if(etat == 1){
      return 'Pris en charge';
    }else if(etat == 2){
      return 'En cours'
    }else if(etat == 3){
      return 'Livrer'
    }else if(etat == 4){
      return 'Annuler'
    }
  }

  // Détermine si le changement d'état de livraison doit être désactivé (verrouillé)
  // selon l'état actuel (ex. une livraison déjà terminée ne peut plus être modifiée).
  disabledLivraison(etat: any){
    if(etat == 0 ){
      return false;
    }else if(etat == 1){
      return false;
    }else if(etat == 2){
      return true;
    }else if(etat == 3){
      return true;
    }else if(etat == 4){
      return true;
    }
  }

  // Vérifie si une commande est entièrement payée (montant restant à zéro).
  isPay(commande: any){
    if(commande.mont_rest == 0){
      return true;
    }else{
      return false;
    }
  }

  // Retourne une classe CSS ('d-none' pour masquer) selon l'état de livraison,
  // afin de cacher certains éléments d'interface une fois la livraison avancée.
  displayLivraison(etat: any){
    if(etat == 0 ){
      return '';
    }else if(etat == 1){
      return '';
    }else if(etat == 2){
      return 'd-none';
    }else if(etat == 3){
      return 'd-none';
    }else if(etat == 4){
      return 'd-none';
    }
  }

  // Associe une couleur (classe CSS) à l'état de livraison, pour l'affichage visuel.
  getEtatLivraisonColor(etat: any){
    if(etat == 0 ){
      return 'warning';
    }else if(etat == 1){
      return 'info';
    }else if(etat == 2){
      return 'primary'
    }else if(etat == 3){
      return 'success'
    }else if(etat == 4){
      return 'danger'
    }
  }

  // Ouvre une boîte de dialogue modale affichant un texte complet (utilisé pour
  // le bouton "voir plus" sur les descriptions tronquées).
  voirPlus(text: any){
    this.dialog.open(VoirPlusComponent, {
      data: {text: text},
      minWidth: '600px'
    })
  }


  // Traduit un numéro de mois (1 à 12) en son nom en français.
  returnMonth(month: number): any{
    if(month == 1){
      return 'Janvier';
    }else if(month == 2){
      return 'Février';
    }else if(month == 3){
      return 'Mars';
    }else if(month == 4){
      return 'Avril';
    }else if(month == 5){
      return 'Mai';
    }else if(month == 6){
      return 'Juin';
    }else if(month == 7){
      return 'Juillet';
    }else if (month == 8){
      return 'Aôut';
    }else if(month == 9){
      return 'Septembre';
    }else if(month == 10){
      return 'Octobre';
    }else if(month == 11){
      return 'Novembre';
    }else if(month == 12){
      return 'Decembre';
    }
  }

  // Affiche une notification "toast" (SweetAlert2) en haut à gauche de l'écran,
  // avec une icône, un titre, une couleur de fond et une durée d'affichage configurables.
  // La minuterie se met en pause si l'utilisateur survole la notification.
  notifications(title_value: any, duration: number, icon_value: any, backgroud_color = '', text_color = ''){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-start',
      showConfirmButton: false,
      background: backgroud_color,
      timer: duration,
      timerProgressBar: true,
      didOpen: (toast: any) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: icon_value,
      title: title_value,
      iconColor: 'red',
      customClass : {
        title: 'swal2-title'
      }
    })
  }

  // Calcule le nombre de mois de retard de paiement d'un contrat (mensuel), en
  // comparant la date du dernier paiement enregistré à la date du jour.
  // Retourne aussi une classe CSS selon la gravité du retard (aucun/1 mois/plus d'1 mois).
  printMonthNotPay(contrat: any): any{
    var i = 0;
    var month_verifie = 0;
    var payement: any = null;
    var response_status = '';
    i = contrat.payements.length;
    payement = contrat.payements[i-1];
    var date = new Date();
  
    var date_demo = new Date(payement?.year+'-'+payement?.month+'-'+28);
    
    month_verifie = this.monthDiff(date_demo, date);

    if(month_verifie <= 0){
      response_status = '';
    }else if(month_verifie == 1){
      response_status = 'warning text-white'
    }else if(month_verifie > 1){
      response_status = 'danger text-white'
    }

    var object = {
      "response_status": response_status,
      "month_verifie": month_verifie
    }
    
    return object;
  }
    
  // Calcule le nombre de jours restants avant la fin du délai de préavis d'un contrat,
  // avec une couleur d'alerte qui s'intensifie à mesure que l'échéance approche
  // (avertissement entre 10 et 15 jours, danger en dessous de 10 jours ou si dépassé).
  dayRestPresAvis(contrat: any){
    var diffDays = 0;
    var date = new Date();
    var color = '';
  
    var end_date = new Date(contrat.date_fin_pres_avis);

    if(date < end_date){
      var diff = Math.abs(end_date.getTime() - date.getTime());
      
       diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 

       if(diffDays <= 15 && diffDays >10){
        color = 'warning text-white';
       }else if(diffDays <= 10){
        color = 'danger text-white';
       }
    }else{
      color = 'danger text-white';
    }

    var object = {
      "response_status": color,
      "diffDays": diffDays
    }

    return object;
  }

  // Calcule le nombre de mois complets entre deux dates (d1 et d2).
  // Utilisé pour déterminer les retards de paiement mensuel.
  monthDiff(d1: any, d2: any) {
    if(d2){
      var d1_params = new Date(d1);
      var d2_params = new Date(d2);

      var months;
      months = (d2_params.getFullYear() - d1_params.getFullYear()) * 12;
      months -= d1_params.getMonth();
      months += d2_params.getMonth();
      return months <= 0 ? 0 : months;
    }else{
      return 0;
    }
  }
}
