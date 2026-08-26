import { CompressImageService } from './../../services/compress-image.service';
import { take } from 'rxjs';
import { ContratService } from 'src/app/services/contrat.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';
import Swal from 'sweetalert2';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-add-raport-for-chantier',
  templateUrl: './add-raport-for-chantier.component.html',
  styleUrls: ['./add-raport-for-chantier.component.css']
})
export class AddRaportForChantierComponent implements OnInit {
  user?: User;
  etatPadding: boolean = false;
  contrat: any;
  mont_diff: any = 0;

  multiplesImages: any[] = [];
  fileData?: any;
  tables: any[] = [];
  tabs: any[] = [];
  constructor(public dialogRef: MatDialogRef<AddRaportForChantierComponent>,
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
    type_raport: ['Selectioner', [Validators.required, selectionerValidator()]],
    date_raport: ['', [Validators.required]],
    montant: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    images: [''],
    video: [],
    desc: ['']
  });


  /**
   * Exécute le traitement associé à la méthode « onSubmit ». 
   */
  onSubmit(){
    this.etatPadding = true; 

    const formData = new FormData();
    
    
    for(let img of this.multiplesImages){
      formData.append('files', img);
    }

      this.contratService.upload(formData).subscribe(res => {
        this._snackBar.openSnackBar("Telechargment d'image en cours...", "");
        const partiesImages: string[] = res.map(url => url.slice(url.indexOf('/piyole-bucket.s3.eu-north-1.amazonaws.com/') + '/piyole-bucket.s3.eu-north-1.amazonaws.com/'.length));
        let filteredTabs = partiesImages.filter(tab => tab.startsWith('images/'));

        let whatsappTabs = partiesImages.filter(tab => tab.startsWith('images/WhatsApp'));
  
        let sortedTabs = filteredTabs.concat(whatsappTabs);
        
        this.images?.setValue(sortedTabs);
        

        this.contratService.addRaportForChantier(this.contrat._id, this.controlForm.value).subscribe(res => {
          Swal.fire("Ajouté", "Le raport est ajouté avec succès", "success");
          this.dialogRef.close();
        })
      });
    
  }

  /**
   * Exécute le traitement associé à la méthode « fileProgress ». 
   */
  fileProgress(event){
    this.tables = [];
    let image: any = event.target.files;
    
    for(var i=0; i< image.length; i++){
      this.compressImage.compress(image[i])
      .pipe(take(1))
      .subscribe(compressedImage => {
        this.tables.push(compressedImage);
        if(event.target.files.length > 0){
          this.multiplesImages = this.tables;
        }
      })
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
