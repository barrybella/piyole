// Validateur asynchrone utilisé lors de la modification du profil : vérifie que le
// nouveau numéro de téléphone saisi n'est pas déjà pris par un AUTRE utilisateur.
import { UserService } from 'src/app/services/user.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// Fonction updateTelUserValidator : exécute le traitement principal défini par cette fonction.
export function updateTelUserValidator(userService: UserService, id): AsyncValidatorFn{
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if(control.value.length > 0){
      return userService.telExist(control.value).pipe(
        map(user => {
            if(user){
                if(user.tel == control.value && id == user._id){
                    return null;    
                }else{
                    return {'telExist': true}
                }
            }
        })
      );
    }else{
      return of([]);
    }
  }
}
