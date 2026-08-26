// Structure de données représentant un utilisateur (client, agence, ou fournisseur).
// Regroupe les informations de profil, de contact, de réseaux sociaux, ainsi que les
// champs techniques liés à l'authentification (token, exp/iat = expiration/émission JWT).
export interface User {
  _id: string;
  slug: string;
  email: string;
  agence: any;
  name: string;
  adress: string;
  role: string;
  new: boolean;
  tel: string;
  code: string;
  baskets: any;
  proffesion: string;
  sexe: string;
  etatCivil: string;
  description: string;
  region: string;
  image: string;
  commune: string;
  quartier: string;
  facebook: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  site: string;
  about: string;
  photo: string;
  createdAt: Date;
  token: any;
  enfant: boolean;
  active: boolean;
  exp: number;
  iat: number;
  }
