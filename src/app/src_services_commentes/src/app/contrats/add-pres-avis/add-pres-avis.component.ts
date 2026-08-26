import { UserService } from 'src/app/services/user.service';
import { ContratService } from 'src/app/services/contrat.service';
import  Swal from 'sweetalert2';
import { Contrat } from './../../interfaces/contrat';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';

@Component({
  selector: 'app-add-pres-avis',
  templateUrl: './add-pres-avis.component.html',
  styleUrls: ['./add-pres-avis.component.css']
})
export class AddPresAvisComponent implements OnInit {
  contrat?: Contrat;
  is_type?: boolean = false;
  etatPadding?: boolean = false;
  passwordIncorect?: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, public dialogRef: MatDialogRef<AddPresAvisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private contratService: ContratService, private userService: UserService) { }

  ngOnInit(): void {
    this.contrat = this.data.contrat;
    // console.log('MY CONTRAT ', this.contrat);
    
  }

  controlForm = this.fb.group({
    nb_month_pres_avis: ['Selectioner', [Validators.required, selectionerValidator()]],
    type_pres_avis: ['Selectioner', [Validators.required, selectionerValidator()]],
    nb_month_not_payed: [0],
    status: [0],
    password: ['', [Validators.required]]
  });

  changeEvent(event: any){
    var eventValue = event.target.value;
    if(eventValue == 1){
      this.is_type = true;
    }else{
      this.is_type = false;
    }
    this.controlEtat();
  }

  message?: any = '';
  status_button: boolean = false;

  controlEtat(){
    var nb_months_pay: number = 0;
    var date = new Date();
    var day_now = date.getDate();
    var month_now = date.getMonth() + 1;
    var year_now = date.getFullYear();

    var tabs: any[] = [];

    //DEBUT CALCUL TABS
    var i = 1;
    this.contrat?.payements.forEach((res: any) => {
    var date = new Date();

    var next_date = new Date(date.setMonth(date.getMonth() + (+i)));

      var day_next = next_date.getDate();
      var month_next = next_date.getMonth() + 1;
      var year_next = next_date.getFullYear();

      // console.log("DTW NEXT ", month_next, year_next, res.month, res.year, res.status);

      this.contrat?.payements.forEach((resp: any) => {
        if(month_next == resp.month && year_next == resp.year && resp.status == 0){
          tabs.push(resp);
          // console.log("OK");
          
        }
      })
      
      i = i +1;
    });
    // FIN CALCULE TABS

    // var next_date = 
    if(!this.is_type){
      this.status?.setValue(1);
      this.status_button= false;
      this.message = '';
      this.nb_month_pres_avis?.setValue(0);
      this.nb_month_pres_avis?.clearValidators();
      this.nb_month_pres_avis?.updateValueAndValidity();

      if(day_now > 15){ 
        if(this.test(this.contrat).month_verifie <= 0){
          if(tabs.length >= 1){
            if(tabs.length == 1){
              this.status_button = true;
              this.message = '';
              
            }else if(tabs.length > 1){
              this.status_button = true;

              nb_months_pay = (tabs.length);
              this.nb_month_pres_avis?.setValue(nb_months_pay);
              this.message = "Vous avez dejat payer " + nb_months_pay + " mois d'avance";
            }
          }else{
            this.status_button = true; // DIFFERENCE ENTRE CENTRAL ET COTER CLIENT
            // this.message = "Vous devez payer le mois suivant car vous avez deppaser le 15 avant de faire a demmande";
            this.message = "";
          }
        }else{
          this.status_button = false;
          this.message = "Vous devez paye les " + this.test(this.contrat).month_verifie + " mois que vous nous devez";
        }
      }else{
        if(this.test(this.contrat).month_verifie <= 0){
          if(tabs.length >= 1){
            this.status_button = true;

            this.message = "Vous avez dejat payer " + tabs.length + " mois d'avance";
            this.nb_month_pres_avis?.setValue(tabs.length);

          }else{
            this.status_button = true;
            this.message = '';
          }
        }else{
          this.status_button = false;
          this.message = "Vous devez paye les " + this.test(this.contrat).month_verifie + " mois que vous nous devez";
        }
      }
    }else{
      this.status?.setValue(2);

      this.message = '';
      this.status_button = false;
      this.nb_month_pres_avis?.setValue('Selectioner');

      this.nb_month_pres_avis?.setValidators([Validators.required, selectionerValidator()]);
      this.nb_month_pres_avis?.updateValueAndValidity();

      if(this.test(this.contrat).month_verifie <= 0){
          if(tabs.length >= 1){
            this.message = 'IMPOSSIBLE!! Il à une avance de ' + tabs.length + ' mois. Vous devez annuler les avances pour lui donner un près.';
            this.status_button = false;
          }else{
            this.status_button = true;
          }
      }else{
        this.status_button = true;
        this.message = 'Il à ' + this.test(this.contrat).month_verifie + ' mois non payé!!'
        this.nb_month_not_payed?.setValue(this.test(this.contrat).month_verifie);
      }
    }
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
        this.contratService.addPresAvis(this.contrat?._id, this.controlForm.value).subscribe(resp => {
          Swal.fire("Ajoiuté", "Pres avis ajouter avec success", "success");
          this.dialogRef.close();
        })
      }
    });
  }

  test(contrat: any): any{
    var i = 0;
    var month_verifie = 0;
    var payement: any = null;
    var response_status = '';
    i = contrat.payements.length;
    // var payements_tab = contrat.payements;
    payement = contrat.payements[i-1];
    var date = new Date();
  
    var date_demo = new Date(payement.year+'-'+payement.month+'-'+28);
    
    month_verifie = this.monthDiff(date_demo, date);

    if(month_verifie <= 0){
      response_status = 'success text-white';
    }else if(month_verifie == 1){
      response_status = 'warning text-white'
    }else if(month_verifie > 1){
      response_status = 'danger text-white'
    }

    var object = {
      "response_status": response_status,
      "month_verifie": month_verifie
    }
    
    return object;
  }

  get nb_month_pres_avis(){
    return this.controlForm.get('nb_month_pres_avis');
  }

  get type_pres_avis(){
    return this.controlForm.get('type_pres_avis');
  }

  get nb_month_not_payed(){
    return this.controlForm.get('nb_month_not_payed');
  }

  get status(){
    return this.controlForm.get('status');
  }

  get password(){
    return this.controlForm.get('password');
  }

  monthDiff(d1: any, d2: any) { var months; months = (d2.getFullYear() - d1.getFullYear()) * 12; months -= d1.getMonth(); months += d2.getMonth(); return months <= 0 ? 0 : months; }
}
