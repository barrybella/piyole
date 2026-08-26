import { Post } from 'src/app/interfaces/post';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import { ContratService } from 'src/app/services/contrat.service';

@Component({
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.css']
})
export class AddParticipantComponent implements OnInit {
  etatPaading: boolean = false;
  contrat: any;
  trouve: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddParticipantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService, private dialog: MatDialog, private userService: UserService) { }

  ngOnInit(): void {
    
  }

  controlForm = this.fb.group({
    status: ['Selectioner', [Validators.required, selectionerValidator()]],
    tel: ['', {
      validators: [
      Validators.required,
        Validators.minLength(9),
        Validators.pattern(/^[0-9+]{9,}$/),
    ]}],
    fonction: ['', [Validators.required]],
    desc: ['', []],
  });

  onSubmit(){
    this.trouve = false;
    this.etatPaading = true;
    // console.log("FORM CONTROL ", this.controlForm.value);

     this.userService.telExist(this.tel?.value).subscribe(res => {
      if(res){
        this.contrat = this.data.contrat;

        var obj = {
          "status": this.status?.value,
          "fonction": this.fonction?.value,
          "desc": this.desc?.value,
        }

        this.contrat.participants.forEach(elem => {
          if(elem.user_id == res._id && elem.delete == 0){
            this.trouve = true;
          }
        })

        // console.log("OBJ ", obj);
        // console.log("CONTRAT ", this.contrat);
        // console.log("res ", res._id);
        if(!this.trouve){
          this.contratService.addParticipantInContrat(this.contrat._id, res._id, obj).subscribe(resp => {
            Swal.fire("Ajouté!", "Participant ajouté avec succès!!", "success");
            this.dialogRef.close();
          })
        }else{
          Swal.fire("Impossible!!", "Cet numero participe dejat à cet chantier", "info");
          this.etatPaading = false;
        }

      }else{
        Swal.fire("Introuvable!!", "Cet numero de telephone n'est pas enregistrer!!", "error");
        this.etatPaading = false;
      }
     })
    
  }

  getParticipants(){

  }

  getTelError(): any{
    if(this.tel?.invalid && (this.tel?.dirty || this.tel?.touched)){
      if(this.tel.errors?.['required']){
        return "Le telephone est requis!!";
      }else if(this.tel.errors?.['minLength']){
        return 'Au moins 9 chiffres!!';
      }else if(this.tel.errors?.['pattern']){
        return 'Telephone incorect!!';
      }
    }
  }

  getTelSuccess(): any{
    if(this.tel?.valid){
      return true;
    }
  }

  get status() {
    return this.controlForm.get('status');
  }

  get tel() {
    return this.controlForm.get('tel');
  }

  get fonction() {
    return this.controlForm.get('fonction');
  }

  get desc() {
    return this.controlForm.get('desc');
  }


}
