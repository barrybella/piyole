import   Swal from 'sweetalert2';
import { Post } from './../../interfaces/post';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { PrintService } from './../../services/print.service';
import { Component, OnInit, Inject } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-on-invest',
  templateUrl: './on-invest.component.html',
  styleUrls: ['./on-invest.component.css']
})
export class OnInvestComponent implements OnInit {
  etatPadding: boolean = false;
  button_active: boolean = false;
  post?: Post;

  constructor(public dialogRef: MatDialogRef<OnInvestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public print: PrintService, private fb: FormBuilder, private postService: PostService, private _snackBar: SnackBarService) { }

  ngOnInit(): void {
    this.post = this.data.post;
    console.log('POST ', this.post);
    
  }

  controlForm = this.fb.group({
    montant: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/), Validators.min(45)]],
    desc: ['', []],
    name: ['', [Validators.required]],
    tel: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    montant_benefice: ['0'],
    pourcentage_investi: ['0'],
    postId: ['0'],
  });

  montant_benefice_front: number = 0;
  pourcentage_investi_front: number = 0;
  mont: number = 0;

  onMontant(event: any){
    this.pourcentage_investi_front = Math.round((+event.target.value * 100)/(this.post?.mont_invest ? this.post?.mont_invest : 1));
      // this.montant_benefice_front = Math.round((this.calculBenefice(this.post?.benefice_prevue, this.pourcentage_investi_front ) * (Math.round((+event.target.value * 100)/(this.post?.mont_invest ? this.post?.mont_invest : 1))))/100) ;
      this.montant_benefice_front = Math.round((this.calculBenefice(this.post?.benefice_prevue, this.pourcentage_investi_front ))) ;
      this.mont = +event.target.value;

      if(this.pourcentage_investi_front >= 1){
        this.button_active = true;
      }else{
        this.button_active = false;
      }
  }

  calculBenefice(montant: any, pourcent: any){
    return (montant * pourcent)/100;
  }

  onSubmit(){
    this.etatPadding = true;
    this._snackBar.openSnackBar("Validation en cours...", "");
    this.postId.setValue(this.post.postId);
    this.montant_benefice.setValue(this.montant_benefice_front);
    this.pourcentage_investi.setValue(this.pourcentage_investi_front);

    this.postService.addInvest(this.post._id, this.controlForm.value).subscribe(res => {
      this.dialogRef.close();
      console.log("INVESTIEMENTS ", res);
      if(res.status == 203){
         Swal.fire("Imossible!!","Impossible d'investir!!", "warning");
      }else{
        Swal.fire("Investi","Vous avez initié un investisement et on vous repondra dans le plus bref delais", "success");
      }
      
    });
  }

  get postId() {
    return this.controlForm.get('postId');
  }

  get montant_benefice() {
    return this.controlForm.get('montant_benefice');
  }

  get pourcentage_investi() {
    return this.controlForm.get('pourcentage_investi');
  }
}
