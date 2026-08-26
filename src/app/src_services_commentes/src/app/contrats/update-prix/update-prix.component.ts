import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { ContratService } from 'src/app/services/contrat.service';
import { Contrat } from './../../interfaces/contrat';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-prix',
  templateUrl: './update-prix.component.html',
  styleUrls: ['./update-prix.component.css']
})
export class UpdatePrixComponent implements OnInit {
  etatPadding: boolean = false;
  passwordIncorect: boolean = false;
  contrat?: Contrat;

  constructor(public dialogRef: MatDialogRef<UpdatePrixComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService, private userService: UserService, private postService: PostService) { }

  ngOnInit(): void {
    this.contrat = this.data.contrat; 
    
    this.initialiseForms();
  }

  controlForm = this.fb.group({
    montant: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  private initialiseForms(){
    this.controlForm.patchValue({
      montant: this.contrat?.montant ? this.contrat?.montant : '0',
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
        this.contratService.updateMontantContrat(this.contrat?._id, this.controlForm.value).subscribe(res => {
          this.postService.updatePriced(this.contrat?.post_id._id, this.controlForm.value).subscribe(res => {
            Swal.fire("Modifié", "Modification reuissie!!", "success");
            this.dialogRef.close();
          })
        })
      }
    });
  }

  get montant() {
    return this.controlForm.get('montant');
  }

  get password() {
    return this.controlForm.get('password');
  }



}
