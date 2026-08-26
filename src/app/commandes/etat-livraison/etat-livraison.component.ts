import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { CommandeService } from 'src/app/services/commande.service';
import { PostService } from 'src/app/services/post.service';
import { PrintService } from 'src/app/services/print.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import Swal from 'sweetalert2';

// Formulaire permettant à l'agence de définir le mode/état de livraison d'une
// commande et son montant associé (frais de livraison).
@Component({
  selector: 'app-etat-livraison',
  templateUrl: './etat-livraison.component.html',
  styleUrls: ['./etat-livraison.component.css']
})
export class EtatLivraisonComponent implements OnInit {
  etatPadding: boolean = false;
  commande: any;
  constructor(public dialogRef: MatDialogRef<EtatLivraisonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private commandeService: CommandeService, private snackBar: SnackBarService, public print: PrintService) { }

  // Récupère la commande transmise par le composant appelant, puis pré-remplit
  // le formulaire avec ses valeurs existantes (édition plutôt que création).
  ngOnInit() {
    this.commande = this.data.commande;
    this.initialiseForms();
  }

  // Pré-remplit le formulaire avec les valeurs actuelles de la commande, ou des
  // valeurs par défaut si elles n'existent pas encore.
  private initialiseForms(){
    this.controlForm.patchValue({
      livraison: this.commande.livraison ? this.commande.livraison : 'Selectioner',
      mont_livraison: this.commande.mont_livraison ? this.commande.mont_livraison : 0,
    });
  }

  // Formulaire réactif : mode de livraison (avec validateur personnalisé empêchant
  // de garder la valeur par défaut "Selectioner") et montant des frais de livraison.
  controlForm = this.fb.group({
    livraison: ['Selectioner', {
      validators: [
      Validators.required,
      selectionerValidator()
    ]}
    ],
    mont_livraison: ['', {
      validators: [
      Validators.required,
      Validators.pattern(/^[0-9+]{1,}$/)
    ]}
    ],
   
  });


  // Enregistre le mode et le montant de livraison choisis, affiche une confirmation
  // et ferme la boîte de dialogue.
  onSubmit(){
    this.etatPadding = true; 
    
    this.commandeService.setEtatLivraison(this.data.commande._id, this.controlForm.value).subscribe(res => {
      this.snackBar.openSnackBar("Livraison Initier", "");
      this.dialogRef.close();
    })
  }

  // Retourne le message d'erreur pour le champ montant de livraison s'il est vide.
  getMontError(){
    if(this.mont_livraison.invalid && (this.mont_livraison.dirty || this.mont_livraison.touched)){
      if(this.mont_livraison.errors.required){
        return "Le montant de la livraison est requis!!";
       
      }
    }
  }

  // Indique si le champ montant de livraison est valide (pour affichage visuel de succès).
  getMontSuccess(){
    if(this.mont_livraison.valid){
      return true;
    }
  }

  get mont_livraison(){
    return this.controlForm.get('mont_livraison');
  }

  get livraison(){
    return this.controlForm.get('livraison');
  }

}
