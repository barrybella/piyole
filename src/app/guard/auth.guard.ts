import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

// Garde de route (Route Guard) protégeant l'accès aux pages nécessitant une authentification.
// Empêche l'accès à certaines routes si l'utilisateur n'est pas connecté.
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private userService: UserService, private router: Router){}

  // Appelée automatiquement par Angular avant d'activer une route protégée.
  // la page de connexion et bloque l'accès à la route demandée.
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    let url = state.url;
    if(this.userService.isLoggedIn()){
        return true;
    }else{
      this.router.navigate(['/users/login']);
      return false;
    }
  }
}
