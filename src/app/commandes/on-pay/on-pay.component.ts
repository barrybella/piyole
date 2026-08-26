import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommandeService } from 'src/app/services/commande.service';
import { PrintService } from 'src/app/services/print.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import Swal from 'sweetalert2';

// Formulaire de confirmation de paiement d'une commande : exige que le montant
// payé corresponde exactement au montant restant dû avant de valider le paiement.
@Component({
  selector: 'app-on-pay',
  templateUrl: './on-pay.component.html',
  styleUrls: ['./on-pay.component.css']
})
export class OnPayComponent implements OnInit {
  etatPadding: boolean = false;
  commande: any;
  constructor(public dialogRef: MatDialogRef<OnPayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private commandeService: CommandeService, private snackBar: SnackBarService, public print: PrintService) { }

  // Méthode ngOnInit : gère la logique métier associée à cette opération.
  ngOnInit() {
    this.commande = this.data.commande;
  }

  // Pré-remplit le formulaire avec le montant déjà payé, le cas échéant
  // (méthode actuellement non appelée dans ngOnInit).
  private initialiseForms(){
    this.controlForm.patchValue({
      mont_pay: this.commande.mont_pay ? this.commande.mont_pay : 0,
    });
  }

  // Formulaire réactif ne contenant que le montant payé.
  controlForm = this.fb.group({
    mont_pay: ['', {
      validators: [
      Validators.required,
      Validators.pattern(/^[0-9+]{1,}$/)
    ]}
    ],
   
  });


  // Vérifie que le montant saisi correspond exactement au montant restant dû sur
  // la commande. Si oui, confirme le paiement auprès du backend et ferme la boîte
  onSubmit(){
    this.etatPadding = true; 

    if(this.commande.mont_rest == this.mont_pay?.value){
      this.commandeService.onPayCommande(this.commande._id, this.controlForm.value).subscribe(res => {
        Swal.fire("Reuissie!!", "Payement effectuer avec sucess!!", "success");
        this.dialogRef.close();
      })
    }else{
      Swal.fire("Impossible!!", "Impossible car le montant restant est diferent au montant payer!!", "info");
      this.etatPadding = false;
    }
    
  }

  // Retourne le message d'erreur pour le champ montant payé s'il est vide.
  getMontError(){
    if(this.mont_pay.invalid && (this.mont_pay.dirty || this.mont_pay.touched)){
      if(this.mont_pay.errors.required){
        return "Le montant de la livraison est requis!!";
       
      }
    }
  }

  // Indique si le champ montant payé est valide (pour affichage visuel de succès).
  getMontSuccess(){
    if(this.mont_pay.valid){
      return true;
    }
  }

  get mont_pay(){
    return this.controlForm.get('mont_pay');
  }

}
