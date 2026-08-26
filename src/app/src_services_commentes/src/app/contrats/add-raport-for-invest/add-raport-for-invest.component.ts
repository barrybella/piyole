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


  onSubmit(){
    this.etatPadding = true; 
    console.log('FORM CONTROL ', this.controlForm.value);
    this.contratService.addRaportForInvest(this.contrat._id, this.controlForm.value).subscribe(res => {
      Swal.fire("Ajouté", "Le raport est ajouté avec succès", "success");
      this.dialogRef.close();
    })
    
  }

  getTitleError(){
    if(this.title.invalid && (this.title.dirty || this.title.touched)){
      if(this.title.errors.required){
        return "Le titre est requis!!";
      }
    }
  }

  getTitleSuccess(){
    if(this.title.valid){
      return true;
    }
  }

  getDateError(){
    if(this.date_raport.invalid && (this.date_raport.dirty || this.date_raport.touched)){
      if(this.date_raport.errors.required){
        return "La date est requise!!";
      }
    }
  }

  getDateSuccess(){
    if(this.date_raport.valid){
      return true;
    }
  }

  getMontantError(){
    if(this.montant.invalid && (this.montant.dirty || this.montant.touched)){
      if(this.montant.errors.pattern){
        return "Le montant est incorect!!";
      }
    }
  }

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
