import { ScriptStore, ScriptStoreHome, ScriptStoreAddBesoin, ScriptStoreRaportConstruction, ScriptStoreStart } from './dynamic-loader.service';
import { Injectable } from '@angular/core';

// Service utilitaire pour injecter dynamiquement des balises <script> dans le <head>
// du document, selon la page/le composant actif. Chaque méthode correspond à un
// ensemble de scripts externes (définis dans dynamic-loader.service.ts) à charger.
@Injectable({
  providedIn: 'root'
})
export class JsService {

  constructor() { }

  // Injecte les scripts nécessaires au composant racine de l'application.
  jsAppComponent() {
    for (var i = 0; i < ScriptStore.length; i++) {
      const node = document.createElement('script');
      node.src = ScriptStore[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

  // Injecte les scripts nécessaires à la page d'accueil.
  jsHome() {
    for (var i = 0; i < ScriptStoreHome.length; i++) {
      const node = document.createElement('script');
      node.src = ScriptStoreHome[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

  // Injecte les scripts nécessaires à l'écran de démarrage/lancement de l'application.
  jsStart() {
    for (var i = 0; i < ScriptStoreStart.length; i++) {
      const node = document.createElement('script');
      node.src = ScriptStoreStart[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('head')[0].appendChild(node);
      console.log("STARTS ");
      
    }
  }

  // Injecte les scripts nécessaires à la page de rapport de construction.
  // ⚠️ Bug probable : la boucle utilise la longueur de ScriptStoreRaportConstruction,
  // mais charge les scripts depuis ScriptStoreHome au lieu de ScriptStoreRaportConstruction.
  jsRaportConstruction() {
    for (var i = 0; i < ScriptStoreRaportConstruction.length; i++) {
      const node = document.createElement('script');
      node.src = ScriptStoreHome[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }

  // Injecte les scripts nécessaires à la page d'ajout de besoin.
  // ⚠️ Bug probable : la boucle utilise la longueur de ScriptStoreAddBesoin,
  // mais charge les scripts depuis ScriptStoreHome au lieu de ScriptStoreAddBesoin.
  jsBesoin() {
    for (var i = 0; i < ScriptStoreAddBesoin.length; i++) {
      const node = document.createElement('script');
      node.src = ScriptStoreHome[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }
}
