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
  selector: 'app-update-participant',
  templateUrl: './update-participant.component.html',
  styleUrls: ['./update-participant.component.css']
})
export class UpdateParticipantComponent implements OnInit {
  etatPaading: boolean = false;
  contrat: any;
  participant: any;
  trouve: boolean = false;

  constructor(public dialogRef: MatDialogRef<UpdateParticipantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService, private dialog: MatDialog, private userService: UserService) { }

  ngOnInit(): void {
    this.contrat = this.data.contrat;
    this.participant = this.data.participant;
    this.initialiseForms();
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
        var obj = {
          "status": this.status?.value,
          "fonction": this.fonction?.value,
          "desc": this.desc?.value,
        }

        this.contrat.participants.forEach(elem => {
          if(elem.user_id == res._id && elem.delete == 0 && elem._id == this.participant?._id){
            this.trouve = false;
            console.log("ELEM ", elem);
            
          }else if(elem.user_id == res._id && elem.delete == 0 && res.tel != this.tel?.value){
            this.trouve = true;
          }
        })

        // console.log("OBJ ", obj);
        // console.log("CONTRAT ", this.contrat);
        // console.log("res ", res._id);
        if(!this.trouve){
          this.contratService.updateParticipant(this.contrat._id, res._id, this.participant._id, obj).subscribe(resp => {
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

  private initialiseForms(){
    this.controlForm.patchValue({
      status: this.participant?.status ? this.participant?.status : '0',
      tel: this.participant?.user_id.tel ? this.participant?.user_id.tel : '',
      fonction: this.participant?.fonction ? this.participant?.fonction : '',
      desc: this.participant?.desc ? this.participant?.desc : '',
    });
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
