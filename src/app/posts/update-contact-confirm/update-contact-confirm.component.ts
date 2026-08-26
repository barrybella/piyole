import { Post } from './../../interfaces/post';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-contact-confirm',
  templateUrl: './update-contact-confirm.component.html',
  styleUrls: ['./update-contact-confirm.component.css']
})
export class UpdateContactConfirmComponent implements OnInit {
  etatPaading: boolean = false;
  post?: any;
  date_limit?: any = null;

  constructor(public dialogRef: MatDialogRef<UpdateContactConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private postService: PostService, private _snackBar: SnackBarService) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void {
    this.getLimiDate();
    this.post = this.data.post;
    
    this.initialiseForms();
  }

  /**
   * Calcule ou récupère la date limite autorisée pour l'opération.
   */
  getLimiDate(){
    var date = new Date();
    var date_modif = null;
    if((date.getMonth() + 1) < 10){
       date_modif = date.getFullYear() +'-0' + (date.getMonth() + 1) +'-' + (date.getDate())
    }else{
      date_modif = date.getFullYear() +'-' + (date.getMonth() + 1) +'-' + (date.getDate())
    }
    
    this.date_limit = date_modif;
  }

  controlForm = this.fb.group({
    name: ['', [Validators.required]],
    tel: ['', {
      validators: [
      Validators.required,
        Validators.minLength(9),
        Validators.pattern(/^[0-9+]{9,}$/),
    ]}],
    adress: ['', [Validators.required]],
    dateRendevous: ['', [Validators.required]],
    time: ['', [Validators.required,]],
    description: ['', []],
    postId: [''],
  });

  /**
   * Valide les données du formulaire et déclenche le traitement de soumission.
   */
  onSubmit(){
    this.etatPaading = true;
    this.postId?.setValue(this.post?.postId);
    this._snackBar.openSnackBar("Modification en cours...", '');
    this.postService.confirmContact(this.post?._id, this.post?.contact._id, this.controlForm.value).subscribe(res => {
      this.etatPaading = false;
      this.dialogRef.close();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Modification Reuissie!',
        showConfirmButton: false,
        timer: 1500
      })
    })
  }

  /**
   * Initialise et configure les formulaires réactifs du composant.
   */
  private initialiseForms(){
    this.controlForm.patchValue({
      tel: this.post?.contact?.tel ? this.post?.contact?.tel : '',
      name: this.post?.contact?.name ? this.post?.contact?.name : '',
      adress: this.post?.contact?.adress ? this.post?.contact?.adress : '',
      dateRendevous: this.post?.contact?.dateRendevous ? this.post?.contact?.dateRendevous : '',
      time: this.post?.contact?.time ? this.post?.contact?.time : '',
      description: this.post?.contact?.description ? this.post?.contact?.description : '',
    });
  }

  /**
   * Retourne le message d'erreur lorsque le numéro de téléphone est invalide.
   */
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

  /**
   * Retourne le message de validation lorsque le numéro de téléphone est valide.
   */
  getTelSuccess(): any{
    if(this.tel?.valid){
      return true;
    }
  }

  /**
   * Retourne le message d'erreur lorsque le nom est invalide.
   */
  getNameError(): any{
    if(this.name?.invalid && (this.name?.dirty || this.name?.touched)){
      if(this.name.errors?.['required']){
        return "Le nom est requis!!";
      }
    }
  }

  /**
   * Retourne le message de validation lorsque le nom est valide.
   */
  getNameSuccess(): any{
    if(this.name?.valid){
      return true;
    }
  }

  /**
   * Retourne le message d'erreur lorsque l'adresse est invalide.
   */
  getAdressError(): any{
    if(this.adress?.invalid && (this.adress?.dirty || this.adress?.touched)){
      if(this.adress.errors?.['required']){
        return "L'adresse est requis!!";
      }
    }
  }

  /**
   * Retourne le message de validation lorsque l'adresse est valide.
   */
  getAdressSuccess(): any{
    if(this.adress?.valid){
      return true;
    }
  }

  /**
   * Retourne le message d'erreur lorsque la date de rendez-vous est invalide.
   */
  getDateRendvousError(): any{
    if(this.dateRendevous?.invalid && (this.dateRendevous?.dirty || this.dateRendevous?.touched)){
      if(this.dateRendevous.errors?.['required']){
        return "La date est requis!!";
      }
    }
  }

  /**
   * Retourne le message de validation lorsque la date de rendez-vous est valide.
   */
  getDateRendvousSuccess(): any{
    if(this.dateRendevous?.valid){
      return true;
    }
  }

  /**
   * Retourne le message d'erreur lorsque l'heure est invalide.
   */
  getTimeError(): any{
    if(this.time?.invalid && (this.time?.dirty || this.time?.touched)){
      if(this.time.errors?.['required']){
        return "La date est requis!!";
      }
    }
  }

  /**
   * Retourne le message de validation lorsque l'heure est valide.
   */
  getTimeSuccess(): any{
    if(this.time?.valid){
      return true;
    }
  }

  get name() {
    return this.controlForm.get('name');
  }

  get tel() {
    return this.controlForm.get('tel');
  }

  get adress() {
    return this.controlForm.get('adress');
  }

  get dateRendevous() {
    return this.controlForm.get('dateRendevous');
  }

  get time() {
    return this.controlForm.get('time');
  }

  get description() {
    return this.controlForm.get('description');
  }

  get postId() {
    return this.controlForm.get('postId');
  }

}
