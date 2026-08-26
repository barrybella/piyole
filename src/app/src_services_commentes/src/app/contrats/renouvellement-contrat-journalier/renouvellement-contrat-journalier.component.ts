import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PrintService } from 'src/app/services/print.service';
import { UserService } from 'src/app/services/user.service';
import { ContratService } from 'src/app/services/contrat.service';
@Component({
  selector: 'app-renouvellement-contrat-journalier',
  templateUrl: './renouvellement-contrat-journalier.component.html',
  styleUrls: ['./renouvellement-contrat-journalier.component.css']
})
export class RenouvellementContratJournalierComponent implements OnInit {
  post?: any;
  passwordIncorect?: boolean = false;
  etatPadding?: boolean = false;
  constructor(private fb: FormBuilder, private router: Router, public dialogRef: MatDialogRef<RenouvellementContratJournalierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public print: PrintService, private userService: UserService, private contratService: ContratService) { }

  ngOnInit(): void {
    this.initialiseForms();
  }

  controlForm = this.fb.group({
    nbDay: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    end_date: [''],
    password: ['', [Validators.required,]],
  });

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
        if(this.data.day_rep > 0){
          if(this.nbDay?.value < this.data.day_rep){
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: 'IMPOSSIBLE!',
              showConfirmButton: false,
              timer: 2000
            });
            this.etatPadding = false;
            return;
          }
        }
        this.end_date?.setValue(this.data.payement.end_date);
        // console.log('CONRR ', this.data.payement);
        
        if(this.nbDay.value <= 0){
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'IMPOSSIBLE! Verifier le nombre de jour',
            showConfirmButton: false,
            timer: 2000
          });
          this.etatPadding = false;
          return;
        }

        this.contratService.renouvelementContratJournalier(this.data.contrat._id, this.data.payement._id, this.controlForm.value).subscribe(resp => {
          this.dialogRef.close();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Reglement Reuissie!',
            showConfirmButton: false,
            timer: 2000
          })
        })
      }
    })
  }

  private initialiseForms(){
    this.controlForm.patchValue({
      nbDay: (+this.data.day_rep) > 0 ? (+this.nbDay?.value) + (+this.data.day_rep): 0,
      
    });
  }

  onClear(event: any){
    this.passwordIncorect = false;
  }

  get password(){
    return this.controlForm.get('password');
  }

  get nbDay(){
    return this.controlForm.get('nbDay');
  }

  get end_date(){
    return this.controlForm.get('end_date');
  }
}
