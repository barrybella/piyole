import { Post } from 'src/app/interfaces/post';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-on-contact-from-result-cherch',
  templateUrl: './on-contact-from-result-cherch.component.html',
  styleUrls: ['./on-contact-from-result-cherch.component.css']
})
export class OnContactFromResultCherchComponent implements OnInit {
  etatPaading: boolean = false;
  contact?: any;
  post?: Post;
  contact_confirms: any[] = [];
  rendezvous: any[] = [];
  date_limit: any = null;
  
  constructor(public dialogRef: MatDialogRef<OnContactFromResultCherchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private postService: PostService, private dialog: MatDialog) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void {
    this.getLimiDate();
    this.initialiseForms();
    this.contact = this.data.contact; 
    this.getPost();
  }

  /**
   * Calcule ou récupère la date limite autorisée pour l'opération.
   */
  getLimiDate(){
    var date = new Date();
    var date_modif = null;
    if((date.getMonth() + 1) < 10){
       date_modif = date.getFullYear() +'-0' + (date.getMonth() + 1) +'-' + this.returnDay(date.getDate())
    }else{
      date_modif = date.getFullYear() +'-' + (date.getMonth() + 1) +'-' + this.returnDay(date.getDate())
    }
    
    this.date_limit = date_modif;
  }

  /**
   * Retourne le jour correspondant à la date fournie.
   */
  returnDay(day: any): any{
    if(day < 10){
      return '0'+day;
    }else{
      return day;
    }
  }

  controlForm = this.fb.group({
    name: ['', [Validators.required]],
    tel: ['', {
      validators: [
      Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^[0-9+]{9,}$/),
    ]}],
    adress: ['', [Validators.required]],
    dateRendevous: ['', [Validators.required]],
    time: ['', [Validators.required,]],
    description: ['', []],
    postId: [''],
    status: ['1'],
  });

  /**
   * Valide les données du formulaire et déclenche le traitement de soumission.
   */
  onSubmit(){
    this.etatPaading = true;
    if(this.post.user_id.tel == this.tel.value){
      Swal.fire(
        'Imposible !!',
        'C\'est vous qui avez posté, votre numero de telephone appartient à cet post!!',
        'warning'
      );
      this.etatPaading = false;
    }else{
      this.postId?.setValue(this.data.contact?.postId);
      this.postService.setContactFromResultCherechByPostId(this.data.contact._id, this.controlForm.value).subscribe(res => {
        this.etatPaading = false;
        this.dialogRef.close();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Contact Enregistrer!',
          showConfirmButton: false,
          timer: 1500
        })
    })
    }
  }

  /**
   * Initialise et configure les formulaires réactifs du composant.
   */
  private initialiseForms(){
    this.controlForm.patchValue({
      tel: this.data.contact.tel ? '' : '',
      name: this.data.contact.name ? '' : '',
      adress: this.data.contact.adress ? '': '',
      description: this.data.contact.description ? '' : '',
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

  /**
   * Récupère les données de l'annonce à partir de son identifiant ou du contexte courant.
   */
  getPost(){
    this.postService.getPost(this.contact._id).subscribe(res => {
      this.post = res;
      this.post.contact.forEach(result => {
        if(result.status == 1){
          this.contact_confirms.push(result);
        }
      })
      console.log('POST ', this.post);
      
    })
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
