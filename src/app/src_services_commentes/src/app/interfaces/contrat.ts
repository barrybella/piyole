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
  //   {
  //     month:  number,
  //     year: number,
     
  //     date: { //DATE PAR DEFAULT DU PAYEMENT
  //         type: Date,
  //     },
  //     status:  number,
  //     montant:  number,
  //   }
  // ];
  description: string;
  contratId: number;
  client_id: User;
  post_id: any;
  user_id: User;
  id_agent: User;
}