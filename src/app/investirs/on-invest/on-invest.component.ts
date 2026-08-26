import   Swal from 'sweetalert2';
import { Post } from './../../interfaces/post';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { PrintService } from './../../services/print.service';
import { Component, OnInit, Inject } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

// Formulaire pour investir dans une opportunité : calcule en temps réel, à mesure
// que l'utilisateur saisit un montant, le pourcentage que représente ce montant par
// rapport au total recherché, ainsi que le bénéfice prévu proportionnel à ce pourcentage.
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

  // Récupère l'annonce d'investissement transmise par le composant appelant.
  ngOnInit(): void {
    this.post = this.data.post;
    
  }

  // Formulaire réactif : montant à investir (minimum 45), description optionnelle,
  // identité de l'investisseur, ainsi que des champs calculés automatiquement
  // (montant_benefice, pourcentage_investi, postId) mis à jour via onMontant().
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

  // Déclenché à chaque saisie du montant à investir : recalcule en temps réel le
  // pourcentage que ce montant représente par rapport au montant total recherché
  // par l'opportunité, ainsi que le bénéfice prévu correspondant. Active le bouton
  // de soumission seulement si le pourcentage investi est significatif (>= 1%).
  onMontant(event: any){
    this.pourcentage_investi_front = Math.round((+event.target.value * 100)/(this.post?.mont_invest ? this.post?.mont_invest : 1));
      this.montant_benefice_front = Math.round((this.calculBenefice(this.post?.benefice_prevue, this.pourcentage_investi_front ))) ;
      this.mont = +event.target.value;

      if(this.pourcentage_investi_front >= 1){
        this.button_active = true;
      }else{
        this.button_active = false;
      }
  }

  // Calcule un bénéfice proportionnel : (bénéfice total prévu × pourcentage) / 100.
  calculBenefice(montant: any, pourcent: any){
    return (montant * pourcent)/100;
  }

  // Complète le formulaire avec les valeurs calculées (bénéfice, pourcentage,
  // identifiant de l'annonce), puis soumet la demande d'investissement au backend.
  // Affiche un message de succès ou d'échec selon la réponse du serveur.
  onSubmit(){
    this.etatPadding = true;
    this._snackBar.openSnackBar("Validation en cours...", "");
    this.postId.setValue(this.post.postId);
    this.montant_benefice.setValue(this.montant_benefice_front);
    this.pourcentage_investi.setValue(this.pourcentage_investi_front);

    this.postService.addInvest(this.post._id, this.controlForm.value).subscribe(res => {
      this.dialogRef.close();
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
