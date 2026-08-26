import { UserService } from '../services/user.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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