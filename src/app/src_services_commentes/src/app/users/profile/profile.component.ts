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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user?: User;
  etatPadding: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private loadingBar: LoadingBarService, private compressImage: CompressImageService) { }

  ngOnInit(): void {
    this.getUser();
  }

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

  // fileData: File = null;

  // // fileProgress(fileInput: any) {
  // //   this.fileData = <File>fileInput.target.files[0];

  // //   if (fileInput.target.files.length > 0) {
  // //     const file = fileInput.target.files[0];
  // //     this.controlForm.get('image').setValue(file);
  // //   }
  // // }

  img: boolean = false;

  fileProgress(event) {
    let image: File = event.target.files[0]
    console.log(`Image size before compressed: ${image.size} bytes.`)

    this.compressImage.compress(image)
      .pipe(take(1))
      .subscribe(compressedImage => {
        // console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
        this.controlForm.get('image').setValue(compressedImage);
        this.img = true;
        // now you can do upload the compressed image 
      })
  }
  // img: any;
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

  getUser(){
    this.loadingBar.start();
    this.userService.profile().subscribe(res => {
      this.user = res;
      this.loadingBar.complete();
      this.initialiseForms();
      console.log('USER SER ', this.user);
      
    })
  }

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

  getTelSuccess(){
    if(this.tel.valid){
      return true;
    }
  }

  getEmailError(){
    if(this.email.invalid && (this.email.dirty || this.email.touched)){
      if(this.email.errors.email){
        return 'Le email est incorect!!';
      }else if(this.email.errors.emailExist){
        return 'Cet email est deja utiliser!!';
      }
    }
  }

  getEmailSuccess(){
    if(this.email.valid){
      return true;
    }
  }

  getNameError(){
    if(this.name.invalid && (this.name.dirty || this.name.touched)){
      if(this.name.errors.required){
        return 'Le nom est requis!!';
      }
    }
  }

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

  ngOnDestroy(){
    this.loadingBar.complete();
  }

}
