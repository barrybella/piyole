import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { ContratService } from 'src/app/services/contrat.service';
import { Contrat } from './../../interfaces/contrat';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-resiliation',
  templateUrl: './add-resiliation.component.html',
  styleUrls: ['./add-resiliation.component.css']
})
export class AddResiliationComponent implements OnInit {
  etatPadding: boolean = false;
  passwordIncorect: boolean = false;
  contrat?: Contrat;

  constructor(public dialogRef: MatDialogRef<AddResiliationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService, private userService: UserService, private postService: PostService) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
    this.contrat = this.data.contrat; 
  }

  controlForm = this.fb.group({
    motif: ['', [Validators.required]],
    password: ['', [Validators.required]],
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
        this.contratService.addResiliation(this.contrat?._id, this.controlForm.value).subscribe(res => {
          Swal.fire("Resilié!!", "Resiliation Reuissie!!", "success");
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
