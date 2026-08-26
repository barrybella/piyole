import { ContratService } from 'src/app/services/contrat.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-raport-for-invest',
  templateUrl: './add-raport-for-invest.component.html',
  styleUrls: ['./add-raport-for-invest.component.css']
})
export class AddRaportForInvestComponent implements OnInit {
  user?: User;
  etatPadding: boolean = false;
  contrat: any;

  constructor(public dialogRef: MatDialogRef<AddRaportForInvestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit() {
    this.contrat = this.data.contrat;
  }

  controlForm = this.fb.group({
    title: ['', {
      validators: [
      Validators.required,
    ]}
    ],
    type_raport: ['Selectioner', [Validators.required, selectionerValidator()]],
    date_raport: ['', [Validators.required]],
    montant: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    desc: ['']
  });


  /**
   * Exécute le traitement associé à la méthode « onSubmit ». 
   */
  onSubmit(){
    this.etatPadding = true; 
    this.contratService.addRaportForInvest(this.contrat._id, this.controlForm.value).subscribe(res => {
      Swal.fire("Ajouté", "Le raport est ajouté avec succès", "success");
      this.dialogRef.close();
    })
    
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getTitleError(){
    if(this.title.invalid && (this.title.dirty || this.title.touched)){
      if(this.title.errors.required){
        return "Le titre est requis!!";
      }
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getTitleSuccess(){
    if(this.title.valid){
      return true;
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getDateError(){
    if(this.date_raport.invalid && (this.date_raport.dirty || this.date_raport.touched)){
      if(this.date_raport.errors.required){
        return "La date est requise!!";
      }
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getDateSuccess(){
    if(this.date_raport.valid){
      return true;
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getMontantError(){
    if(this.montant.invalid && (this.montant.dirty || this.montant.touched)){
      if(this.montant.errors.pattern){
        return "Le montant est incorect!!";
      }
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getMontantSuccess(){
    if(this.montant.valid){
      return true;
    }
  }

  get title(){
    return this.controlForm.get('title');
  }

  get date_raport(){
    return this.controlForm.get('date_raport');
  }

  get montant(){
    return this.controlForm.get('montant');
  }
}
