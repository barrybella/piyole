// Validateur asynchrone utilisé lors de la modification du profil : vérifie que le
// nouvel email saisi n'est pas déjà pris par un AUTRE utilisateur (contrairement à
// l'inscription, on autorise ici que l'utilisateur garde son propre email actuel).
import { UserService } from 'src/app/services/user.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// Fonction updateEmailUserValidator : exécute le traitement principal défini par cette fonction.
export function updateEmailUserValidator(userService: UserService, id): AsyncValidatorFn{
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if(control.value.length > 0){
      return userService.emailExist(control.value).pipe(
        map(user => {
            if(user){
                if(user.email == control.value && id == user._id){
                    return null;    
                }else{
                    return {'emailExist': true}
                }
            }
        })
    )
    }else{
      return of([]);
    }
  }
}
