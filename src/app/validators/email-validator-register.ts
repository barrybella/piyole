
            
//     )

// Validateur asynchrone de formulaire : vérifie, à l'inscription, si l'email saisi
// est déjà utilisé par un compte existant, en interrogeant le backend en temps réel.
import { UserService } from '../services/user.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Fonction emailValidatorRegister : exécute le traitement principal défini par cette fonction.
export function emailValidatorRegister(userServive: UserService): AsyncValidatorFn{
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return userServive.emailExist(control.value).pipe(
       map(user => {
        if(user){
          return {'emailExist': true}
        }else{
          return null;
        }
    })
    )
  }
}
