import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';

export function selectionerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    return (v === 'Selectioner') ? { "oddNum": true } : null;    
    // return (v === 'Selectioner') ? null : null;    
  };
}