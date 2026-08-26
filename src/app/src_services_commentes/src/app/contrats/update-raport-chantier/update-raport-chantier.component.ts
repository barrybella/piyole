import { CompressImageService } from './../../services/compress-image.service';
import { take } from 'rxjs';
import { SnackBarService } from './../../services/snack-bar.service';
import { ContratService } from 'src/app/services/contrat.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-raport-chantier',
  templateUrl: './update-raport-chantier.component.html',
  styleUrls: ['./update-raport-chantier.component.css']
})
export class UpdateRaportChantierComponent implements OnInit {
  user?: User;
  etatPadding: boolean = false;
  raport?: any;
  contrat?: any;
  mont_diff_solde?: number = 0;
  mont_versement?: number = 0;
  mont_depense?: number = 0;

  multiplesImages: any[] = [];
  fileData?: any;
  tables: any[] = [];
  tabs: any[] = [];
  constructor(public dialogRef: MatDialogRef<UpdateRaportChantierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService, private _snackBar: SnackBarService, private compressImage: CompressImageService) { }

  ngOnInit() {
    this.raport = this.data.result;
    this.contrat = this.data.contrat;

    // this.mont_diff_solde = (+this.getMontantVersementAgence(this.contrat)) - (+this.getDepense(this.contrat));
    this.mont_versement = (+this.getMontantVersementAgence(this.contrat));
    this.mont_depense = (+this.getDepense(this.contrat));

    // console.log('MONT DIFF  ', this.mont_versement);
    this.initialiseForms();
    

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
    desc: [''],
    images: ['']
  });

  fileProgress(event){
    this.tables = [];
    let image: any = event.target.files;
    
    for(var i=0; i< image.length; i++){
      this.compressImage.compress(image[i])
      .pipe(take(1))
      .subscribe(compressedImage => {
        this.tables.push(compressedImage);
        // now you can do upload the compressed image 
        if(event.target.files.length > 0){
          this.multiplesImages = this.tables;
        }
      })
    }
  }

  private initialiseForms(){
    this.controlForm.patchValue({
      title: this.raport.title ? this.raport.title : '',
      type_raport: this.raport.type_raport ? this.raport.type_raport : '0',
      date_raport: this.raport.date_raport ? this.getOnlyDate(this.raport.date_raport) : '',
      montant: this.raport.montant ? this.raport.montant : '',
      desc: this.raport.desc ? this.raport.desc : '',
    });
  }

  onSubmit(){
    this.etatPadding = true; 
    const formData = new FormData();
    
    
    for(let img of this.multiplesImages){
      formData.append('files', img);
    }
    this._snackBar.openSnackBar("Modification en cours...", "");

    if(+this.montant?.value){
      var mont = 0;
      var mont_calcule = 0;
      mont = (+this.mont_depense) - (+this.raport?.montant);
      mont_calcule = (+this.mont_versement) - (+mont);

       
          this.contratService.upload(formData).subscribe(res => {
            this._snackBar.openSnackBar("Telechargment d'image en cours...", "");
            const partiesImages: string[] = res.map(url => url.slice(url.indexOf('/piyole-bucket.s3.eu-north-1.amazonaws.com/') + '/piyole-bucket.s3.eu-north-1.amazonaws.com/'.length));
            // Filtrer et trier les éléments commençant par "images/"
            let filteredTabs = partiesImages.filter(tab => tab.startsWith('images/'));

            // Filtrer et trier les éléments commençant par "images/WhatsApp"
            let whatsappTabs = partiesImages.filter(tab => tab.startsWith('images/WhatsApp'));
      
            // Fusionner les deux tableaux filtrés
            let sortedTabs = filteredTabs.concat(whatsappTabs);
            
            this.images?.setValue(sortedTabs);
    
            this.contratService.updateRaport(this.raport.contrat_id, this.raport._id, this.controlForm.value).subscribe(res => {
              this.dialogRef.close();
              Swal.fire("Modifié", "Modification Reuissie avec succès", "success");
            });
          });
      
    }else{
      this.contratService.upload(formData).subscribe(res => {
        this._snackBar.openSnackBar("Telechargment d'image en cours...", "");
            const partiesImages: string[] = res.map(url => url.slice(url.indexOf('/piyole-bucket.s3.eu-north-1.amazonaws.com/') + '/piyole-bucket.s3.eu-north-1.amazonaws.com/'.length));
            // Filtrer et trier les éléments commençant par "images/"
            let filteredTabs = partiesImages.filter(tab => tab.startsWith('images/'));

            // Filtrer et trier les éléments commençant par "images/WhatsApp"
            let whatsappTabs = partiesImages.filter(tab => tab.startsWith('images/WhatsApp'));
      
            // Fusionner les deux tableaux filtrés
            let sortedTabs = filteredTabs.concat(whatsappTabs);
            
            this.images?.setValue(sortedTabs);

        this.contratService.updateRaport(this.raport.contrat_id, this.raport._id, this.controlForm.value).subscribe(res => {
          this.dialogRef.close();
          Swal.fire("Modifié", "Modification Reuissie avec succès", "success");
        });
      });
    }
  }

  getMontantVersementAgence(contrat: any){
    var mont = 0;
    contrat.agence_versements.forEach((res: any) => {
      if(res.status == 0){
        mont = +(res.montant) + mont;
      }
    });
    return mont;
  }

  getDepense(contrat){
    var mont = 0;
    contrat.raports.forEach(res => {
      if(res.delete == 0){
        mont = +(res.montant) + mont;
      }
    });
    return mont;
  }

  getTitleError(){
    if(this.title.invalid && (this.title.dirty || this.title.touched)){
      if(this.title.errors.required){
        return "Le titre est requis!!";
      }
    }
  }

  getTitleSuccess(){
    if(this.title.valid){
      return true;
    }
  }

  getDateError(){
    if(this.date_raport.invalid && (this.date_raport.dirty || this.date_raport.touched)){
      if(this.date_raport.errors.required){
        return "La date est requise!!";
      }
    }
  }

  getDateSuccess(){
    if(this.date_raport.valid){
      return true;
    }
  }

  getMontantError(){
    if(this.montant.invalid && (this.montant.dirty || this.montant.touched)){
      if(this.montant.errors.pattern){
        return "Le montant est incorect!!";
      }
    }
  }

  getMontantSuccess(){
    if(this.montant.valid){
      return true;
    }
  }

  getOnlyDate(date){
    let date_transform = new Date(date);
    return date_transform.getFullYear() + "-" + ((date_transform.getMonth() + 1) < 10 ? "0" + (date_transform.getMonth() + 1) : (date_transform.getMonth() + 1)) + "-" + (date_transform.getDate() < 10 ? "0" + date_transform.getDate() : date_transform.getDate());
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

}
