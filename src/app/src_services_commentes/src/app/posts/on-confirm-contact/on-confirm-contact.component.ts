// import { RendezVousIngenieurComponent } from './../rendez-vous-ingenieur/rendez-vous-ingenieur.component';
import { Post } from 'src/app/interfaces/post';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-on-confirm-contact',
  templateUrl: './on-confirm-contact.component.html',
  styleUrls: ['./on-confirm-contact.component.css']
})
export class OnConfirmContactComponent implements OnInit {
  etatPaading: boolean = false;
  contact?: any;
  post?: Post;
  posting?: any;
  contact_confirms: any[] = [];
  rendezvous: any[] = [];
  date_limit?: any = null;

  constructor(public dialogRef: MatDialogRef<OnConfirmContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private postService: PostService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getLimiDate();
    this.contact = this.data.post.contact; 
    this.posting = this.data.post; 
    console.log("CONTRATS ", this.posting);
    
    this.initialiseForms();
  }

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
        Validators.minLength(9),
        Validators.pattern(/^[0-9+]{9,}$/),
    ]}],
    adress: ['', [Validators.required]],
    dateRendevous: ['', [Validators.required]],
    time: ['', [Validators.required,]],
    description: ['', []],
    postId: [''],
  });

  onSubmit(){
    this.etatPaading = true;
    this.postId?.setValue(this.posting?.postId);
    this.postService.confirmContact(this.posting?._id, this.contact?._id, this.controlForm.value).subscribe(res => {
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

  private initialiseForms(){
    this.controlForm.patchValue({
      tel: this.contact?.tel ? this.contact?.tel : '',
      name: this.contact?.name ? this.contact?.name : '',
      adress: this.contact?.adress ? this.contact?.adress : '',
      description: this.contact?.description ? this.contact?.description : '',
    });
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

  getNameError(): any{
    if(this.name?.invalid && (this.name?.dirty || this.name?.touched)){
      if(this.name.errors?.['required']){
        return "Le nom est requis!!";
      }
    }
  }

  getNameSuccess(): any{
    if(this.name?.valid){
      return true;
    }
  }

  getAdressError(): any{
    if(this.adress?.invalid && (this.adress?.dirty || this.adress?.touched)){
      if(this.adress.errors?.['required']){
        return "L'adresse est requis!!";
      }
    }
  }

  getAdressSuccess(): any{
    if(this.adress?.valid){
      return true;
    }
  }

  getDateRendvousError(): any{
    if(this.dateRendevous?.invalid && (this.dateRendevous?.dirty || this.dateRendevous?.touched)){
      if(this.dateRendevous.errors?.['required']){
        return "La date est requis!!";
      }
    }
  }

  getDateRendvousSuccess(): any{
    if(this.dateRendevous?.valid){
      return true;
    }
  }

  getTimeError(): any{
    if(this.time?.invalid && (this.time?.dirty || this.time?.touched)){
      if(this.time.errors?.['required']){
        return "La date est requis!!";
      }
    }
  }

  getTimeSuccess(): any{
    if(this.time?.valid){
      return true;
    }
  }

  getPost(){
    this.postService.getPost(this.contact.post_id).subscribe(res => {
      this.post = res;
      this.post.contact.forEach(result => {
        if(result.status == 1){
          this.contact_confirms.push(result);
        }
      })
      
    })
  }

  onRendevous(){
    // this.dialog.open(RendezVousIngenieurComponent, {
    //   data: {"rendezvous": this.rendezvous},
    //   width: '400px',
    // })
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
