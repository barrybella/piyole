import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { ContratService } from 'src/app/services/contrat.service';
import { Contrat } from './../../interfaces/contrat';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stop-contrat',
  templateUrl: './stop-contrat.component.html',
  styleUrls: ['./stop-contrat.component.css']
})
export class StopContratComponent implements OnInit {
  etatPadding: boolean = false;
  passwordIncorect: boolean = false;
  contrat?: Contrat;

  constructor(public dialogRef: MatDialogRef<StopContratComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService, private userService: UserService, private postService: PostService) { }

  ngOnInit(): void {
    this.contrat = this.data.contrat; 
    // console.log("CONTRAT ", this.contrat);
  }

  controlForm = this.fb.group({
    motif: ['', []],
    password: ['', [Validators.required]],
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
        this.contratService.stopContrat(this.contrat?._id, this.controlForm.value).subscribe(res => {
          Swal.fire("Stopé!!", "Contrat Stopé!!", "success");
          this.dialogRef.close();
        })
      }
    });
  }

  get motif() {
    return this.controlForm.get('motif');
  }

  get password() {
    return this.controlForm.get('password');
  }

}
