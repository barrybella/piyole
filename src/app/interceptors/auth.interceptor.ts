import { UserService } from './../services/user.service';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Intercepteur HTTP global : ajoute automatiquement le token JWT de l'utilisateur
// connecté à l'en-tête "Authorization" de chaque requête HTTP sortante, sans avoir
// à le faire manuellement dans chaque appel de service (voir app.module.ts pour son
// enregistrement en tant que fournisseur global).
@Injectable()

export class AuthInterceptor implements HttpInterceptor{
    // Méthode constructor : gère la logique métier associée à cette opération.
    constructor(private userService: UserService){}
    
    // Clone la requête sortante en y ajoutant l'en-tête d'autorisation, puis la
    // transmet à la suite de la chaîne d'intercepteurs/au serveur.
    intercept(req: HttpRequest<any>, next:HttpHandler){ 
        const authReq =  req.clone({
            headers: req.headers.set('Authorization', `Bearer ${this.userService.getToken()}`)
        });

        return next.handle(authReq);
    }

}
