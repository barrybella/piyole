import { UserService } from './../../services/user.service';
import { PrintService } from 'src/app/services/print.service';
import { Post } from 'src/app/interfaces/post';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostService } from 'src/app/services/post.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import Swal from 'sweetalert2';
import { ContratService } from 'src/app/services/contrat.service';

@Component({
  selector: 'app-add-entretien',
  templateUrl: './add-entretien.component.html',
  styleUrls: ['./add-entretien.component.css']
})
export class AddEntretienComponent implements OnInit {
  etatPaading: boolean = false;
  post?: any;
  contact?: any;
  months: any[] = [];
  days: any[] = [];
  montant: number = 0;
  byMonth: boolean = false;
  byDay: boolean = false;
  passwordIncorect: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddEntretienComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private postService: PostService, private contratService: ContratService, public print: PrintService, private userService: UserService) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void {
    this.post = this.data.post;
    this.contact = this.data.post.contact;
    

    this.getDays();
    this.getMonths();
    this.initialiseForms();
  }

  controlForm = this.fb.group({
    etatCivil: ['Selectioner', [Validators.required, selectionerValidator()]],
    sexe: ['Selectioner', [Validators.required, selectionerValidator()]],
    proffesion: ['', [Validators.required]],
    nbPersone: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/),]],
    nbVoiture: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/),]],
    nbMoto: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/),]],
    animal: ['', []],
    detail: ['', []],
    image: ['', []],
    carte: ['', []],
    email: ['', {
        validators: [
        Validators.required, Validators.email
      ]
    }
    ],
    nbMonth: ['Selectioner', [Validators.required, selectionerValidator()]],
    type_contrat: ['Selectioner', [Validators.required, selectionerValidator()]],
    nbDay: ['Selectioner', ],
    nb_day_diff: [0, []],
    mont_day_diff: [0, []],
    password: ['', [Validators.required]],
  });

  /**
   * Valide les données du formulaire et déclenche le traitement de soumission.
   */
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
        this.contratService.getContratByPostIdIfPresAvis(this.post?._id).subscribe(result => {
          if(result){
            this.dialogRef.close(); 
            Swal.fire(
              'Pres avis en cours!!',
              "Cet post a un pres avis en cours sur le contrat " + result.contratId + " qui expire le " + result.date_fin_pres_avis,
              'warning'
            ); 
          }else{
            this.userService.telExist(this.contact?.tel).subscribe(resp => {
              if(resp){
                this.submitLocation();
              }else{
                this.userService.emailExist(this.email?.value).subscribe(result => {
                  if(!result){
                    this.submitLocation();
                  }else{
                    Swal.fire("Impossible!!", "Cet email est dejat utilisé par le client " + result.name + " " + result.tel, "warning");
                    this.etatPaading = false;
                  }
                })
              }
            })
            
          }
        })
      }
    });
  }

  /**
   * Valide et enregistre les informations de localisation.
   */
  submitLocation(){
    this.contratService.getContratByPostIdIfPresAvis(this.post?._id).subscribe(result => {
      if(result){
        this.dialogRef.close(); 
        Swal.fire(
          'Pres avis en cours!!',
          "Cet post a un pres avis en cours sur le contrat " + result.contratId + " qui expire le " + result.date_fin_pres_avis,
          'warning'
        ); 
      }else{
        this.userService.telExist(this.contact?.tel).subscribe(resp => {
          if(resp){
            this.submitDoc();
          }else{
            this.userService.emailExist(this.email?.value).subscribe(result => {
              if(!result){
                this.submitDoc();
              }else{
                Swal.fire("Impossible!!", "Cet email est dejat utilisé par le client " + result.name + " " + result.tel, "warning");
                this.etatPaading = false;
              }
            })
          }
        })
        
      }
    })
   
  }

  /**
   * Valide et traite le document sélectionné.
   */
  submitDoc(){
    const formData = new FormData();
    const formDataCarte = new FormData();
    formData.append('file', this.fileData);
    formDataCarte.append('file', this.fileDataCarte);
    

    if(this.type_contrat.value == 2){
        this.onSub();
    }else{
      if(this.image?.value && this.carte?.value){
        this.userService.uploadImage(formData).subscribe(resp => {
          this.image?.setValue(resp.path);
    
          this.userService.uploadCarte(formDataCarte).subscribe(result => {
            this.carte?.setValue(result.path);
            this.onSub();
          })
        })
      }else{
        Swal.fire("Impossible!!", "L'image et la carte d'identification sont requise!!", "warning");
        this.etatPaading = false;
      }
     
    }
  }

  /**
   * Traite la soumission de l'étape ou du formulaire courant.
   */
  onSub(){
    this.contratService.addContrat(this.post?._id, this.contact?._id, this.controlForm.value).subscribe(res => {
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
  }

  fileData?: any ;

  /**
   * Traite la progression et les informations du fichier sélectionné.
   */
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];

    if (fileInput.target.files.length > 0) {
      const file = fileInput.target.files[0];
      this.controlForm.get('image')?.setValue(file);

    }
  }

  fileDataCarte?: any ;

  /**
   * Traite la progression du téléversement de la carte ou du document associé.
   */
  fileProgressCarte(fileInput: any) {
    this.fileDataCarte = <File>fileInput.target.files[0];

    if (fileInput.target.files.length > 0) {
      const file = fileInput.target.files[0];
      this.controlForm.get('carte')?.setValue(file);

    }
  }

  nb_day_free?: number = 0;
  day_diff?: number = 0;
  mont_day_rest?: number = 0;
  show_days_offert?: boolean = false;

  /**
   * Calcule le montant correspondant aux paramètres sélectionnés.
   */
  calculMont(){
    this.initialiseForms();

    var curent_date = new Date();
    var day = +curent_date.getDate();
    var post = this.post;
    var nb_day_free = +post.nb_day_free;
    var mode_payement = post.mode_payement;
    var day_diff = 0;
    var mont_day_rest = 0;

    if(mode_payement){
      this.show_days_offert = false;
      if(day >= nb_day_free){
        var nbDayByMonth = this.daysInMonth((curent_date.getMonth() + 1), curent_date.getFullYear())
        day_diff = +(nbDayByMonth - day);
        var montant_day = Math.round(post.prix/nbDayByMonth);
        mont_day_rest = (day_diff) * montant_day;
        this.nb_day_free = nb_day_free;
        this.day_diff = day_diff;
        this.mont_day_rest = mont_day_rest;
        this.mont_day_diff?.setValue(mont_day_rest);
        this.nb_day_diff?.setValue(day_diff);
      

      }
    }else{
      this.show_days_offert = false;
      if(day >= nb_day_free){
        this.show_days_offert = true;
        var nbDayByMonth = this.daysInMonth((curent_date.getMonth() + 1), curent_date.getFullYear())
        day_diff = +(nbDayByMonth - day);
        this.nb_day_free = nb_day_free;
        this.day_diff = day_diff;
        

      }
    }


    this.montant = 0;
    var nbTime = 0;

    if(post.avance){
      if(post.periode == 'Mois'){
        this.montant = (post.prix * post.temps) + (post.caution ? post.caution : 0) + mont_day_rest;
      }else {
        nbTime = post.temps * 12;
        this.montant = (post.prix * nbTime) + (post.caution ? post.caution : 0) + mont_day_rest;
      }
    }else{
      this.montant = (post.caution ? post.caution : 0) + mont_day_rest;
    }
  }

  /**
   * Gère le changement de valeur d'un champ ou d'une sélection.
   */
  changeEvent(event: any){
    var post = this.post;
    this.montant = 0;
    this.montant = (post.prix * (+event.target.value)) + (post.caution ? post.caution : 0);
  }

  show_info: boolean = false;
  col_type: number = 12;

  /**
   * Exécute le traitement associé à la méthode « eventIfByDay ».
   */
  eventIfByDay(event: any){
    if(event.target.value == 0){
      this.col_type = 6;
      this.show_info = true;

      console.log("POSTING ", this.post);
      this.calculMont();
      this.byDay = false;
      this.byMonth = true;
      this.nbDay?.setValue(0);

      this.nbDay?.clearValidators();
      this.nbDay?.updateValueAndValidity();

      this.nbMonth?.setValidators([Validators.required, selectionerValidator()]);
      this.nbMonth?.updateValueAndValidity()
    }else if(event.target.value == 1){
      this.col_type = 6;
      this.show_info = true;

      this.nbDay?.setValue('Selectioner');
      this.mont_day_rest = 0;
      this.show_days_offert = false;
      this.calculMontForDays();
      this.byDay = true;
      this.byMonth = false;
      this.nbDay?.setValidators([Validators.required, selectionerValidator()]);
      this.nbDay?.updateValueAndValidity();
    }else{
      this.col_type = 12;
      this.show_info = false;

      this.byDay = false;
      this.byMonth = false;
      this.calculMont();
      this.mont_day_rest = 0;
      this.show_days_offert = false;
      this.nbDay?.setValue(0);
      this.nbMonth?.setValue(0);

      this.nbDay?.clearValidators();
      this.nbMonth?.clearValidators();
      
      this.nbDay?.updateValueAndValidity();
      this.nbMonth?.updateValueAndValidity();
    }
  }


  /**
   * Exécute le traitement associé à la méthode « changeEventDays ».
   */
  changeEventDays(event: any){
    this.calculMontForDays();
  }

  /**
   * Retourne ou calcule la liste des jours disponibles.
   */
  getDays(){
    for (var i = 1; i<= 300; i++) {
      this.days.push(i);
    }
  }

  /**
   * Calcule le montant en fonction du nombre de jours sélectionné.
   */
  calculMontForDays(){
    var curent_date = new Date();
    var post = this.post;
    this.montant = 0;

    var nbDayByMonth = this.daysInMonth((curent_date.getMonth() + 1), curent_date.getFullYear())
    var montant_day = Math.round(post.prix/nbDayByMonth);
    this.montant = (this.nbDay?.value) * montant_day;
    if(isNaN(this.montant)){
      this.montant = 0;
    }
  
  }

  /**
   * Calcule le nombre de jours du mois spécifié.
   */
  daysInMonth(month: any, year: any) {
    return new Date(year, month, 0).getDate();
  }

  /**
   * Initialise et configure les formulaires réactifs du composant.
   */
  private initialiseForms(){
    var number = 0;
    
    if(this.post.avance == true){
      if(this.post.periode == 'Mois'){
        number = this.post.temps;
      }else{
        number = this.post.temps * 12;
      }
    }else{
      number = 0
    }

    this.controlForm.patchValue({
      nbMonth: number,
    });
  }

  /**
   * Retourne le message d'erreur lorsque la profession est invalide.
   */
  getProffesionError(): any{
    if(this.proffesion?.invalid && (this.proffesion?.dirty || this.proffesion?.touched)){
      if(this.proffesion.errors?.['required']){
        return "La proffesion est requise!!";
      }
    }
  }

  /**
   * Retourne le message de validation lorsque la profession est valide.
   */
  getProffesionSuccess(): any{
    if(this.proffesion?.valid){
      return true;
    }
  }

  /**
   * Retourne le message d'erreur lorsque le nombre de personnes est invalide.
   */
  getNbPersoneError(): any{
    if(this.nbPersone?.invalid && (this.nbPersone?.dirty || this.nbPersone?.touched)){
      if(this.nbPersone.errors?.['required']){
        return "Le nombre de personne est requis!!";
      }else if(this.nbPersone.errors?.['pattern']){
        return "Nombre de personne incorect!!"
      }
    }
  }

  /**
   * Retourne le message de validation lorsque le nombre de personnes est valide.
   */
  getNbPersoneSuccess(): any{
    if(this.nbPersone?.valid){
      return true;
    }
  }

  /**
   * Retourne le message d'erreur lorsque le nombre de voitures est invalide.
   */
  getNbVoitureError(): any{
    if(this.nbVoiture?.invalid && (this.nbVoiture?.dirty || this.nbVoiture?.touched)){
      if(this.nbVoiture.errors?.['required']){
        return "Le nombre de voiture est requis!!";
      }else if(this.nbVoiture.errors?.['pattern']){
        return "Nombre de voiture incorect!!"
      }
    }
  }

  /**
   * Retourne le message de validation lorsque le nombre de voitures est valide.
   */
  getNbVoitureSuccess(): any{
    if(this.nbVoiture?.valid){
      return true;
    }
  }

  /**
   * Retourne le message d'erreur lorsque le nombre de motos est invalide.
   */
  getNbMotoError(): any{
    if(this.nbMoto?.invalid && (this.nbMoto?.dirty || this.nbMoto?.touched)){
      if(this.nbMoto.errors?.['required']){
        return "Le nombre de moto est requis!!";
      }else if(this.nbMoto.errors?.['pattern']){
        return "Nombre de moto incorect!!"
      }
    }
  }

  /**
   * Retourne le message de validation lorsque le nombre de motos est valide.
   */
  getNbMotoSuccess(): any{
    if(this.nbMoto?.valid){
      return true;
    }
  }

  /**
   * Retourne la liste des mois disponibles.
   */
  getMonths(){
    for (var i = 0; i<= 100; i++) {
      this.months.push(i);
    }
  }

  /**
   * Retourne le message d'erreur lorsque l'adresse courriel est invalide.
   */
  getEmailError(): any {
    if (this.email?.invalid && (this.email.dirty || this.email.touched)) {
      if (this.email.errors?.['required']) {
        return 'L\'adresse email est requise!';
      }else if(this.email.errors?.['email']){
        return 'Email incorrecte!!';
      }
    }
  }

  /**
   * Retourne le message de validation lorsque l'adresse courriel est valide.
   */
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

  get nbDay() {
    return this.controlForm.get('nbDay');
  }


  get nb_day_diff() {
    return this.controlForm.get('nb_day_diff');
  }

  get mont_day_diff() {
    return this.controlForm.get('mont_day_diff');
  }

  get image() {
    return this.controlForm.get('image');
  }

  get carte() {
    return this.controlForm.get('carte');
  }

  get type_contrat() {
    return this.controlForm.get('type_contrat');
  }

}
