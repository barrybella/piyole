import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';

// Service responsable de l'upload d'images vers un bucket AWS S3.
// ⚠️ ATTENTION SÉCURITÉ : les clés d'accès AWS ont été retirées de ce fichier (elles
// étaient codées en dur, donc visibles par n'importe qui via les outils développeur
// du navigateur). Si l'ancienne clé n'a pas encore été révoquée côté AWS IAM, fais-le
// immédiatement. À terme, cet upload devrait être déplacé vers un endpoint backend,
// où les clés restent dans des variables d'environnement serveur, jamais exposées au client.
@Injectable({
  providedIn: 'root'
})
export class S3Service {

  private bucketName: string = 'piyole-bucket'; // Nom du bucket S3 cible
  private s3: any; // Instance du client AWS S3

  // Initialise la configuration AWS et crée le client S3 dès la création du service.
  // Les clés d'accès ont été retirées du code source (elles ne doivent jamais être
  // codées en dur, surtout dans du code frontend visible par le navigateur).
  // Idéalement, l'upload S3 devrait se faire depuis un endpoint backend, où les clés
  // restent dans des variables d'environnement serveur, jamais exposées au client.
  constructor() {
    AWS.config.update({
      accessKeyId: '', // TODO: à retirer du frontend, à gérer côté backend
      secretAccessKey: '' // TODO: à retirer du frontend, à gérer côté backend
    });
    this.s3 = new AWS.S3();
  }

  // Envoie une liste d'images vers S3 en parallèle et retourne les URLs publiques
  // une fois tous les envois terminés (ou rejette si l'un d'eux échoue).
  uploadImages(images: File[]): Promise<string[]> {
    const uploadPromises: Promise<string>[] = [];

    for (const image of images) {
      // Paramètres d'upload pour l'image courante : nom de fichier utilisé comme clé S3,
      // et accès public en lecture pour que l'image soit affichable directement via son URL.
      const params = {
        Bucket: this.bucketName,
        Key: image.name,
        Body: image,
        ACL: 'public-read' // Rendre l'image publique
      };

      // Encapsule l'appel S3 (basé sur des callbacks) dans une Promise pour pouvoir
      // l'utiliser avec Promise.all plus bas.
      const uploadPromise = new Promise<string>((resolve, reject) => {
        this.s3.upload(params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.Location); // URL de l'image sur S3
          }
        });
      });

      uploadPromises.push(uploadPromise);
    }

    // Attend que tous les uploads soient terminés avant de retourner la liste des URLs.
    return Promise.all(uploadPromises);
  }
}
