import { UserService } from 'src/app/services/user.service';
import { Post } from 'src/app/interfaces/post';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostService } from 'src/app/services/post.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import Swal from 'sweetalert2';
import { ContratService } from 'src/app/services/contrat.service';

@Component({
  selector: 'app-add-contrat-for-sale',
  templateUrl: './add-contrat-for-sale.component.html',
  styleUrls: ['./add-contrat-for-sale.component.css']
})
export class AddContratForSaleComponent implements OnInit {
  etatPaading: boolean = false;
  passwordIncorect: boolean = false;
  post?: any;
  contact?: any;
  months: any[] = [];
  montant: number = 0;

  constructor(public dialogRef: MatDialogRef<AddContratForSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private postService: PostService, private contratService: ContratService, private userService: UserService) { }

  ngOnInit(): void {
    this.post = this.data.post;
    this.contact = this.data.post.contact;

    this.getMonths();
    this.initialiseForms();
    this.calculMont();
  }

  controlForm = this.fb.group({
    etatCivil: ['Selectioner', [Validators.required, selectionerValidator()]],
    sexe: ['Selectioner', [Validators.required, selectionerValidator()]],
    proffesion: ['', [Validators.required]],
    detail: ['', []],
    email: ['', {
      validators: [
      Validators.required, Validators.email
    ]}
    ],
    image: ['', [Validators.required]],
    carte: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit(){
    this.etatPaading = true;
    let tel: string;
    tel = this.userService.getUserDetails().tel;
    var object = {
      login: tel,
      password: this.password?.value
    };

    this.userService.confirmPasswordLogin(object).subscribe(res => {
      if(!res){
        this.passwordIncorect = true;
        this.etatPaading = false;
      }else{ 
        this.userService.telExist(this.contact?.tel).subscribe(resp => {
          if(resp){
            this.submitSale();
          }else{
            this.userService.emailExist(this.email?.value).subscribe(result => {
              if(!result){
                this.submitSale();
              }else{
                Swal.fire("Impossible!!", "Cet email est dejat utilisé par le client " + result.name + " " + result.tel, "warning");
                this.etatPaading = false;
              }
            })
          }
        })
      }
    });
  }

  submitSale(){
    const formData = new FormData();
    const formDataCarte = new FormData();
    formData.append('file', this.fileData);
    formDataCarte.append('file', this.fileDataCarte);

    this.userService.uploadImage(formData).subscribe(resp => {
      this.image?.setValue(resp.path);

      this.userService.uploadCarte(formDataCarte).subscribe(result => {
        this.carte?.setValue(result.path);
      
        this.contratService.addContratForSale(this.post?._id, this.contact?._id, this.controlForm.value).subscribe(res => {
          this.etatPaading = false;
          this.dialogRef.close();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Contrat success!',
            showConfirmButton: false,
            timer: 2000
          })
        })
      })
    })
   
  }

  fileDataCarte?: any ;

  fileProgressCarte(fileInput: any) {
    this.fileDataCarte = <File>fileInput.target.files[0];

    if (fileInput.target.files.length > 0) {
      const file = fileInput.target.files[0];
      this.controlForm.get('carte')?.setValue(file);
      // console.log('JE SUIS LE FILE PHOTOS', file);

    }
  }


  fileData?: any ;

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];

    if (fileInput.target.files.length > 0) {
      const file = fileInput.target.files[0];
      this.controlForm.get('image')?.setValue(file);
      // console.log('JE SUIS LE FILE PHOTOS', file);

    }
  }

  calculMont(){
    var post = this.post;
    this.montant = 0;
    var nbTime = 0;

    if(post.avance){
      if(post.periode == 'Mois'){
        this.montant = (post.prix * post.temps) + (post.caution ? post.caution : 0);
      }else {
        nbTime = post.temps * 12;
        this.montant = (post.prix * nbTime) + (post.caution ? post.caution : 0);
      }
    }else{
      this.montant = post.caution ? post.caution : 0;
    }
  }

  changeEvent(event: any){
    var post = this.post;
    this.montant = 0;
    this.montant = (post.prix * (+event.target.value)) + (post.caution ? post.caution : 0);
  }

  private initialiseForms(){
    var number = 0;
    console.log('AVANCE ', this.post.avance);
    
    if(this.post.avance == true){
      console.log('dedans ');
      
      if(this.post.periode == 'Mois'){
        number = this.post.temps;
      }else{
        number = this.post.temps * 12;
      }
    }else{
      console.log('DEHORS ');
      number = 0
    }

    this.controlForm.patchValue({
      nbMonth: number,
    });
  }

  getProffesionError(): any{
    if(this.proffesion?.invalid && (this.proffesion?.dirty || this.proffesion?.touched)){
      if(this.proffesion.errors?.['required']){
        return "La proffesion est requise!!";
      }
    }
  }

  getProffesionSuccess(): any{
    if(this.proffesion?.valid){
      return true;
    }
  }

  getNbPersoneError(): any{
    if(this.nbPersone?.invalid && (this.nbPersone?.dirty || this.nbPersone?.touched)){
      if(this.nbPersone.errors?.['required']){
        return "Le nombre de personne est requis!!";
      }else if(this.nbPersone.errors?.['pattern']){
        return "Nombre de personne incorect!!"
      }
    }
  }

  getNbPersoneSuccess(): any{
    if(this.nbPersone?.valid){
      return true;
    }
  }

  getNbVoitureError(): any{
    if(this.nbVoiture?.invalid && (this.nbVoiture?.dirty || this.nbVoiture?.touched)){
      if(this.nbVoiture.errors?.['required']){
        return "Le nombre de voiture est requis!!";
      }else if(this.nbVoiture.errors?.['pattern']){
        return "Nombre de voiture incorect!!"
      }
    }
  }

  getNbVoitureSuccess(): any{
    if(this.nbVoiture?.valid){
      return true;
    }
  }

  getNbMotoError(): any{
    if(this.nbMoto?.invalid && (this.nbMoto?.dirty || this.nbMoto?.touched)){
      if(this.nbMoto.errors?.['required']){
        return "Le nombre de moto est requis!!";
      }else if(this.nbMoto.errors?.['pattern']){
        return "Nombre de moto incorect!!"
      }
    }
  }

  getNbMotoSuccess(): any{
    if(this.nbMoto?.valid){
      return true;
    }
  }

  getMonths(){
    for (var i = 0; i<= 100; i++) {
      this.months.push(i);
    }
  }

  getEmailError(): any {
    if (this.email?.invalid && (this.email.dirty || this.email.touched)) {
      if (this.email.errors?.['required']) {
        return 'L\'adresse email est requise!';
      }else if(this.email.errors?.['email']){
        return 'Email incorrecte!!';
      }
    }
  }

  getEmailSuccess(): any {
    if (this.email?.valid) {
      return true;
    }
  }

  get password() {
    return this.controlForm.get('password');
  }

  get email() {
    return this.controlForm.get('email');
  }

  get proffesion() {
    return this.controlForm.get('proffesion');
  }

  get animal() {
    return this.controlForm.get('animal');
  }

  get nbPersone() {
    return this.controlForm.get('nbPersone');
  }

  get nbMoto() {
    return this.controlForm.get('nbMoto');
  }

  get nbVoiture() {
    return this.controlForm.get('nbVoiture');
  }

  get detail() {
    return this.controlForm.get('detail');
  }

  get nbMonth() {
    return this.controlForm.get('nbMonth');
  }

  get carte() {
    return this.controlForm.get('carte');
  }

  get image() {
    return this.controlForm.get('image');
  }

}
