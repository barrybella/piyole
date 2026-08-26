// import { UserService } from '../services/user.service';
// import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// export function emailValidatorRegister(userServive: UserService, route): AsyncValidatorFn{
//   return (control: AbstractControl): Promise<ValidationErrors | null | any> | any| Observable<ValidationErrors | null> => {
//     return userServive.emailExist(control.value).pipe(
//        map((user: any): any => {
//           if(user.length > 0){
//             console.log("HELLO JE TROUVE");
            
//               return {'emailExist': true}
//           }else{
//               return null;
//           }
//         })
//     )
//   }
// }

import { UserService } from '../services/user.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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