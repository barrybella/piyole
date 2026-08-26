import { Post } from './../../interfaces/post';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-devis',
  templateUrl: './add-devis.component.html',
  styleUrls: ['./add-devis.component.css']
})
export class AddDevisComponent implements OnInit {
  post?: Post;
  etatPadding: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddDevisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private route: ActivatedRoute, private postService: PostService, private userService: UserService) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit() {
  }

  controlForm = this.fb.group({
 
    desc_devis: ['', [Validators.required]],
    pdf: [''],
  });


  /**
   * Valide les données du formulaire et déclenche le traitement de soumission.
   */
  onSubmit(){
    this.etatPadding = true; 
    const formData = new FormData();
    formData.append('file', this.fileData);

    this.postService.uploadPdf(formData).subscribe(resp => {
      this.pdf?.setValue(resp.path);

      this.postService.setDevis(this.data.post._id, this.controlForm.value).subscribe(res => {
        Swal.fire("Ajouté", "Devie ajouter avec success", "success");
        this.dialogRef.close();
      })
    })
   
  }

  fileData: File = null;

  /**
   * Traite la progression et les informations du fichier sélectionné.
   */
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];

    if (fileInput.target.files.length > 0) {
      const file = fileInput.target.files[0];
      this.controlForm.get('pdf').setValue(file);

    }
  }

  /**
   * Déclenche la procédure de prise de contact.
   */
  contactMe(){
    this.postService.setContactPost(this.data.post._id, this.controlForm.value).subscribe(res => {
      this.etatPadding = false;
      this.dialogRef.close();
      Swal.fire(
        'Contact Effectuer!',
        'Vous allez recevoir un message de confirmation!',
        'success'
      );
    })
  }

  /**
   * Retourne le message d'erreur lorsque le titre est invalide.
   */
  getTitleError(){
    if(this.title.invalid && (this.title.dirty || this.title.touched)){
      if(this.title.errors.required){
        return "Le titre (materiel) est requis!!";
      }
    }
  }

  /**
   * Retourne le message de validation lorsque le titre est valide.
   */
  getTitleSuccess(){
    if(this.title.valid){
      return true;
    }
  }

  /**
   * Retourne le message d'erreur lorsque le prix est invalide.
   */
  getPrixError(){
    if(this.prix.invalid && (this.prix.dirty || this.prix.touched)){
      if(this.prix.errors.required){
        return "Le prix est requis!!";
      }else if(this.prix.errors.pattern){
        return 'Que des chiffres!!';
      }
    }
  }

  /**
   * Retourne le message de validation lorsque le prix est valide.
   */
  getPrixSuccess(){
    if(this.prix.valid){
      return true;
    }
  }

  /**
   * Retourne le message de validation lorsque la description est valide.
   */
  getDescSuccess(){
    if(this.desc_devis.valid){
      return true;
    }
  }

  /**
   * Retourne le message d'erreur lorsque la description est invalide.
   */
  getDescError(){
    if(this.desc_devis.invalid && (this.desc_devis.dirty || this.desc_devis.touched)){
      if(this.desc_devis.errors.required){
        return "Le prix est requis!!";
      }
    }
  }

  

  get title(){
    return this.controlForm.get('title');
  }

  get desc_devis(){
    return this.controlForm.get('desc_devis');
  }

  get prix(){
    return this.controlForm.get('prix');
  }

  get pdf(){
    return this.controlForm.get('pdf');
  }
}
