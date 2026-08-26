// Structure de la réponse du serveur après une authentification réussie (contient le token JWT).
export interface TokenResponse {
    token: string;
  }
  
  // Structure des données envoyées au serveur pour se connecter ou s'inscrire
  // (le nom est optionnel, requis seulement à l'inscription).
  export interface TokenPayload {
    email: string;
    password: string;
    name?: string;
  }
