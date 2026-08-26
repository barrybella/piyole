import { LoadingBarService } from '@ngx-loading-bar/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { updateTelUserValidator } from 'src/app/validators/update-tel.validator';
import { updateEmailUserValidator } from 'src/app/validators/update-email.validator';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CompressImageService } from 'src/app/services/compress-image.service';
import { take } from 'rxjs';

// Page/formulaire de modification du profil utilisateur : identité, coordonnées,
// localisation, réseaux sociaux, présentation ("about") et photo de profil (avec
// compression d'image avant envoi). Utilise des validateurs asynchrones "update"
// spécifiques (autorisant l'utilisateur à garder son propre email/téléphone actuel).
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user?: User;
  etatPadding: boolean = false;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private loadingBar: LoadingBarService, private compressImage: CompressImageService) { }

  ngOnInit(): void {
    this.getUser();
  }

  // Formulaire réactif regroupant tous les champs modifiables du profil : identité,
  // localisation, réseaux sociaux, présentation et image.
  controlForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', {
      validators: [
        Validators.email,
     ],
      asyncValidators: [updateEmailUserValidator(this.userService, this.userService.getUserDetails()._id)]}
   ],    
   tel: ['', {
      validators: [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern(/^[0-9+]{9,}$/),
    ],
      asyncValidators: [updateTelUserValidator(this.userService, this.userService.getUserDetails()._id)]}
    ],  
    code: ['', [Validators.required]],
    region: ['', []],
    commune: ['', []],
    quartier: ['', []],
    facebook: ['', []],
    instagram: ['', []],
    twitter: ['', []],
    tiktok: ['', []],
    site: ['', []],
    about: ['', []],
    image: ['', []]
  });




  img: boolean = false;

  // Déclenché à la sélection d'une nouvelle photo de profil : compresse l'image
  // avant de la placer dans le formulaire, pour réduire son poids avant l'envoi.
  fileProgress(event) {
    let image: File = event.target.files[0]

    this.compressImage.compress(image)
      .pipe(take(1))
      .subscribe(compressedImage => {
        this.controlForm.get('image').setValue(compressedImage);
        this.img = true;
        // now you can do upload the compressed image 
      })
  }
  // Si une nouvelle image a été sélectionnée, l'envoie d'abord au serveur puis
  // directement sans toucher à l'image existante.
  onSubmit(){
    this.etatPadding = true;
    const formData = new FormData();
    formData.append('file', this.image.value);
    if(this.img){
      this.userService.uploadImage(formData).subscribe(resp => {
        this.image?.setValue(resp.path);
  
        this.userService.editProfil(this.controlForm.value).subscribe(res => {
          Swal.fire('Profil mis à jour!', '', 'success');
          this.router.navigate(['home']);
        })
      })
    }else{
      this.userService.editProfil(this.controlForm.value).subscribe(res => {
        Swal.fire('Profil mis à jour!', '', 'success');
        this.router.navigate(['home']);
      })
    }
  }

  // Récupère les données actuelles du profil, puis pré-remplit le formulaire.
  getUser(){
    this.loadingBar.start();
    this.userService.profile().subscribe(res => {
      this.user = res;
      this.loadingBar.complete();
      this.initialiseForms();
      
    })
  }

  // Pré-remplit le formulaire avec les valeurs actuelles du profil, en repliant
  // sur les informations du token JWT (nom, téléphone) si elles sont absentes du
  // profil détaillé, et sur une chaîne vide pour les champs optionnels non renseignés.
  private initialiseForms(){
    this.controlForm.patchValue({
      name: this.user.name ? this.user.name : this.userService.getUserDetails().name,
      email: this.user.email ? this.user.email : '',
      tel: this.user.tel ? this.user.tel : this.userService.getUserDetails().tel,
      region: this.user.region ? this.user.region : '',
      commune: this.user.commune ? this.user.commune : '',
      quartier: this.user.quartier ? this.user.quartier : '',
      facebook: this.user.facebook ? this.user.facebook : '',
      instagram: this.user.instagram ? this.user.instagram : '',
      twitter: this.user.twitter ? this.user.twitter : '',
      tiktok: this.user.tiktok ? this.user.tiktok : '',
      site: this.user.site ? this.user.site : '',
      about: this.user.about ? this.user.about : '',
      image: this.user?.image ? this.user.image : '',
      code: this.user?.code ? this.user.code : '',
    });
  }

  // Retourne le message d'erreur approprié pour le champ téléphone.
  getTelError(){
    if(this.tel.invalid && (this.tel.dirty || this.tel.touched)){
      if(this.tel.errors.required){
        return "Le telephone est requis!!";
      }else if(this.tel.errors.minLength){
        return 'Telephone incorect!!';
      }else if(this.tel.errors.telExist){
        return 'Cet numero est deja utiliser!!';
      }else if(this.tel.errors.codeErr){
        return 'Code telephone incorect!!';
      }else if(this.tel.errors.pattern){
        return 'Telephone incorect!!';
      }
    }
  }

  // Indique si le champ téléphone est valide (pour affichage visuel de succès).
  getTelSuccess(){
    if(this.tel.valid){
      return true;
    }
  }

  // Retourne le message d'erreur approprié pour le champ email.
  getEmailError(){
    if(this.email.invalid && (this.email.dirty || this.email.touched)){
      if(this.email.errors.email){
        return 'Le email est incorect!!';
      }else if(this.email.errors.emailExist){
        return 'Cet email est deja utiliser!!';
      }
    }
  }

  // Indique si le champ email est valide (pour affichage visuel de succès).
  getEmailSuccess(){
    if(this.email.valid){
      return true;
    }
  }

  // Retourne le message d'erreur pour le champ nom s'il est vide.
  getNameError(){
    if(this.name.invalid && (this.name.dirty || this.name.touched)){
      if(this.name.errors.required){
        return 'Le nom est requis!!';
      }
    }
  }

  // Indique si le champ nom est valide (pour affichage visuel de succès).
  getNameSuccess(){
    if(this.name.valid){
      return true;
    }
  }

  get image(){
    return this.controlForm.get('image');
  }

  get tel(){
    return this.controlForm.get('tel');
  }

  get email(){
    return this.controlForm.get('email');
  }

  get name(){
    return this.controlForm.get('name');
  }

  // Méthode ngOnDestroy : gère la logique métier associée à cette opération.
  ngOnDestroy(){
    this.loadingBar.complete();
  }

}
