import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import  Swal from 'sweetalert2';
import { ContratService } from 'src/app/services/contrat.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-raport',
  templateUrl: './delete-raport.component.html',
  styleUrls: ['./delete-raport.component.css']
})
export class DeleteRaportComponent implements OnInit {
  contrat?: any;
  raport?: any;
  mont_versement?: any = 0;
  mont_depense?: any = 0;
  etatPadding: boolean = false;
  passwordIncorect: boolean = false;
  // mont_calcule?: any = 0;
  // mont_response?: any = 0;
  // mont_versement?: any = 0;

  constructor(public dialogRef: MatDialogRef<DeleteRaportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService, private dialog: MatDialog, private userService: UserService, private _snackBar: SnackBarService) { }

  ngOnInit(): void {
    this.raport = this.data.result;
    this.contrat = this.data.contrat;

    // this.mont_diff_solde = (+this.getMontantVersementAgence(this.contrat)) - (+this.getDepense(this.contrat));
    this.mont_versement = (+this.getMontantVersementAgence(this.contrat));
    this.mont_depense = (+this.getDepense(this.contrat)); 
    
    this.initialiseForms();
  }

  control_form = this.fb.group({
    // montant: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    // desc: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  private initialiseForms(){
    this.control_form.patchValue({
      montant: this.raport?.montant ? this.raport?.montant : '',
      desc: this.raport?.desc ? this.raport?.desc : '',
    });
  }

  onSubmit(){
    this.etatPadding = true;
    let tel: string;
    tel = this.userService.getUserDetails().tel;
    var object = {
      login: tel,
      password: this.password?.value
    };

    this.userService.confirmPasswordLogin(object).subscribe(res => {
      if(!res){
        this.passwordIncorect = true;
        this.etatPadding = false;
      }else{ 
        this._snackBar.openSnackBar("Suppresion en cours...", '')
        this.contratService.deleteRaport(this.contrat?._id, this.raport?._id).subscribe(res => {
          Swal.fire("Suprimé", "Suppresion reuisse avec succès!!", "success");
          this.dialogRef.close();
        })
      }
    })
  }

  getMontantForConstruct(contrat: any){
    var mont = 0;
    contrat.construction_payements.forEach((res: any) => {
      if(res.status == 0){
        mont = +(res.montant) + mont;
      }
    });
    return mont;
  }

  getMontantVersementAgence(contrat: any){
    var mont = 0;
    contrat.agence_versements.forEach((res: any) => {
      if(res.status == 0){
        mont = +(res.montant) + mont;
      }
    });
    return mont;
  }

  getDepense(contrat: any){
    var mont = 0;
    contrat.raports.forEach((res: any) => {
      if(res.delete == 0){
        mont = +(res.montant) + mont;
      }
    });
    return mont;
  }

  // get montant(){
  //   return this.control_form.get('montant');
  // }

  get password(){
    return this.control_form.get('password');
  }

}
