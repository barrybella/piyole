import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommandeService } from 'src/app/services/commande.service';
import { PrintService } from 'src/app/services/print.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import Swal from 'sweetalert2';

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

  ngOnInit() {
    this.commande = this.data.commande;
    // this.initialiseForms();
  }

  private initialiseForms(){
    this.controlForm.patchValue({
      mont_pay: this.commande.mont_pay ? this.commande.mont_pay : 0,
    });
  }

  controlForm = this.fb.group({
    mont_pay: ['', {
      validators: [
      Validators.required,
      Validators.pattern(/^[0-9+]{1,}$/)
    ]}
    ],
   
  });


  onSubmit(){
    this.etatPadding = true; 

    if(this.commande.mont_rest == this.mont_pay?.value){
      this.commandeService.onPayCommande(this.commande._id, this.controlForm.value).subscribe(res => {
        Swal.fire("Reuissie!!", "Payement effectuer avec sucess!!", "success");
        // this.etatPadding = false;
        this.dialogRef.close();
      })
    }else{
      Swal.fire("Impossible!!", "Impossible car le montant restant est diferent au montant payer!!", "info");
      this.etatPadding = false;
    }
    
    // this.commandeService.setEtatLivraison(this.data.commande._id, this.controlForm.value).subscribe(res => {
    //   this.snackBar.openSnackBar("Livraison Initier", "");
    //   this.dialogRef.close();
    // })
  }

  getMontError(){
    if(this.mont_pay.invalid && (this.mont_pay.dirty || this.mont_pay.touched)){
      if(this.mont_pay.errors.required){
        return "Le montant de la livraison est requis!!";
       
      }
    }
  }

  getMontSuccess(){
    if(this.mont_pay.valid){
      return true;
    }
  }

  get mont_pay(){
    return this.controlForm.get('mont_pay');
  }

}
