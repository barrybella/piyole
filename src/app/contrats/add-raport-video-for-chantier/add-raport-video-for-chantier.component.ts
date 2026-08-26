import { SnackBarService } from 'src/app/services/snack-bar.service';
import { CompressImageService } from './../../services/compress-image.service';
import { take } from 'rxjs';
import { ContratService } from 'src/app/services/contrat.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-raport-video-for-chantier',
  templateUrl: './add-raport-video-for-chantier.component.html',
  styleUrls: ['./add-raport-video-for-chantier.component.css']
})
export class AddRaportVideoForChantierComponent implements OnInit {
  user?: User;
  etatPadding: boolean = false;
  contrat: any;
  mont_diff: any = 0;

  constructor(public dialogRef: MatDialogRef<AddRaportVideoForChantierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService, private compressImage: CompressImageService, private _snackBar: SnackBarService) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit() {
    this.contrat = this.data.contrat;
    this.mont_diff = (+this.getMontantVersementAgence(this.contrat)) - (+this.getDepense(this.contrat));

  }

  controlForm = this.fb.group({
    title: ['', {
      validators: [
      Validators.required,
    ]}
    ],
    type_raport: ['5'],
    date_raport: ['', [Validators.required]],
    montant: [''],
    images: [],
    video: ['', [Validators.required]],
    desc: ['']
  });


  /**
   * Exécute le traitement associé à la méthode « onSubmit ». 
   */
  onSubmit(){
    this._snackBar.uploadVideoOpenSnackBar("Telechargement de la vidéo en cours.. Veuillez patientez...", "");
    this.etatPadding = true; 
    const formDataVideo = new FormData();
    formDataVideo.append('file', this.fileDataVideo);


      this.contratService.uploadVideo(formDataVideo).subscribe(resp => {

        const mots = resp.location.split("/");
        const im = mots[3]+"/"+mots[4];
        this.video.setValue(im);

        this.contratService.addRaportForChantier(this.contrat._id, this.controlForm.value).subscribe(res => {
          Swal.fire("Ajouté", "Le raport est ajouté avec succès", "success");
          this.dialogRef.close();
        })
      });
     
    
  }

 
  fileDataVideo?: any;

  /**
   * Exécute le traitement associé à la méthode « fileVideoProgress ». 
   */
  fileVideoProgress(event){
    this.fileDataVideo = <File>event.target.files[0];

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.controlForm.get('video').setValue(file);
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getTitleError(){
    if(this.title.invalid && (this.title.dirty || this.title.touched)){
      if(this.title.errors.required){
        return "Le titre est requis!!";
      }
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getTitleSuccess(){
    if(this.title.valid){
      return true;
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getDateError(){
    if(this.date_raport.invalid && (this.date_raport.dirty || this.date_raport.touched)){
      if(this.date_raport.errors.required){
        return "La date est requise!!";
      }
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getDateSuccess(){
    if(this.date_raport.valid){
      return true;
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getMontantError(){
    if(this.montant.invalid && (this.montant.dirty || this.montant.touched)){
      if(this.montant.errors.pattern){
        return "Le montant est incorect!!";
      }
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getMontantSuccess(){
    if(this.montant.valid){
      return true;
    }
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getMontantVersementAgence(contrat: any){
    var mont = 0;
    contrat.agence_versements.forEach((res: any) => {
      if(res.status == 0){
        mont = +(res.montant) + mont;
      }
    });
    return mont;
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getDepense(contrat){
    var mont = 0;
    contrat.raports.forEach(res => {
      if(res.delete == 0){
        mont = +(res.montant) + mont;
      }
    });
    return mont;
  }

  get title(){
    return this.controlForm.get('title');
  }

  get date_raport(){
    return this.controlForm.get('date_raport');
  }

  get montant(){
    return this.controlForm.get('montant');
  }

  get images(){
    return this.controlForm.get('images');
  }

  get video(){
    return this.controlForm.get('video');
  }
}
