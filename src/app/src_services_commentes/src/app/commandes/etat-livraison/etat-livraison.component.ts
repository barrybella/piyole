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

  ngOnInit() {
    this.commande = this.data.commande;
    this.initialiseForms();
  }

  private initialiseForms(){
    this.controlForm.patchValue({
      livraison: this.commande.livraison ? this.commande.livraison : 'Selectioner',
      mont_livraison: this.commande.mont_livraison ? this.commande.mont_livraison : 0,
    });
  }

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


  onSubmit(){
    this.etatPadding = true; 
    
    this.commandeService.setEtatLivraison(this.data.commande._id, this.controlForm.value).subscribe(res => {
      this.snackBar.openSnackBar("Livraison Initier", "");
      this.dialogRef.close();
    })
  }

  getMontError(){
    if(this.mont_livraison.invalid && (this.mont_livraison.dirty || this.mont_livraison.touched)){
      if(this.mont_livraison.errors.required){
        return "Le montant de la livraison est requis!!";
       
      }
    }
  }

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
