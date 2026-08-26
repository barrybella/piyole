// Structure de données représentant un contrat : location, vente ou construction.
// Contient les informations financières (montant, caution), l'état d'avancement pour
// les contrats de construction (status_construct), l'historique des paiements
// (payements, structure détaillée en commentaire), et les liens vers les parties
// prenantes (client, agent, utilisateur/agence, annonce d'origine).
import { User } from "./user";

export interface Contrat {
  _id: string;
  status: number;
  delete: number;
  caution: number;
  montant: number;
  nbPersone: number;
  status_construct: number;
  nbVoiture: number;
  nbMoto: number;
  nb_month: number;
  date_fin_exuction: any;
  date_fin_pres_avis: any;
  animal: string;
  type_contrat: string;
  payements : any;
  // [
  //     month:  number,
  //     year: number,
     
  //     status:  number,
  //     montant:  number,
  description: string;
  contratId: number;
  client_id: User;
  post_id: any;
  user_id: User;
  id_agent: User;
}
