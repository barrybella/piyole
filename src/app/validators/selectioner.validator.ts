// Validateur de formulaire : invalide un champ de sélection (dropdown) si sa valeur
// est toujours celle par défaut ("Selectioner"), forçant l'utilisateur à faire un vrai choix.
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';

// Fonction selectionerValidator : exécute le traitement principal défini par cette fonction.
export function selectionerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    return (v === 'Selectioner') ? { "oddNum": true } : null;    
  };
}
