// Validateur asynchrone de formulaire : vérifie, à l'inscription, si le numéro de
// téléphone saisi est déjà utilisé par un compte existant.
import { UserService } from '../services/user.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Fonction telValidatorRegister : exécute le traitement principal défini par cette fonction.
export function telValidatorRegister(userServive: UserService): AsyncValidatorFn{
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return userServive.telExist(control.value).pipe(
       map(user => {
        if(user){
          return {'telExist': true}
        }else{
          return null;
        }
    })
    )
  }
}
