import { Post } from './../../interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PrintService } from 'src/app/services/print.service';
import { UserService } from 'src/app/services/user.service';
import { ContratService } from 'src/app/services/contrat.service';

@Component({
  selector: 'app-add-payement',
  templateUrl: './add-payement.component.html',
  styleUrls: ['./add-payement.component.css']
})
export class AddPayementComponent implements OnInit {
  post?: any;
  passwordIncorect?: boolean = false;
  etatPadding?: boolean = false;
  constructor(private fb: FormBuilder, private router: Router, public dialogRef: MatDialogRef<AddPayementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public print: PrintService, private userService: UserService, private contratService: ContratService) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
  }

  controlForm = this.fb.group({
    password: ['', [Validators.required,]]
  });

  /**
   * Exécute le traitement associé à la méthode « onSubmit ». 
   */
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
        this.contratService.reglement(this.data.contrat._id, this.data.month, this.data.year).subscribe(resp => {
          this.dialogRef.close();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Reglement Reuissie!',
            showConfirmButton: false,
            timer: 2000
          });
          this.dialogRef.close();
        })
      }
    })
  }

  /**
   * Exécute le traitement associé à la méthode « onClear ». 
   */
  onClear(event: any){
    if(this.passwordIncorect){
      this.passwordIncorect = false;
    }
  }

  get password(){
    return this.controlForm.get('password');
  }
}
