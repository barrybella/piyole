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

  ngOnInit() {
  }

  controlForm = this.fb.group({
    // title: ['', {
    //   validators: [
    //   Validators.required,
    // ]}
    // ],
    desc_devis: ['', [Validators.required]],
    pdf: [''],
    // prix: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]]
  });


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

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];

    if (fileInput.target.files.length > 0) {
      const file = fileInput.target.files[0];
      this.controlForm.get('pdf').setValue(file);
      // console.log('JE SUIS LE FILE PHOTOS', file);

    }
  }

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

  getTitleError(){
    if(this.title.invalid && (this.title.dirty || this.title.touched)){
      if(this.title.errors.required){
        return "Le titre (materiel) est requis!!";
      }
    }
  }

  getTitleSuccess(){
    if(this.title.valid){
      return true;
    }
  }

  getPrixError(){
    if(this.prix.invalid && (this.prix.dirty || this.prix.touched)){
      if(this.prix.errors.required){
        return "Le prix est requis!!";
      }else if(this.prix.errors.pattern){
        return 'Que des chiffres!!';
      }
    }
  }

  getPrixSuccess(){
    if(this.prix.valid){
      return true;
    }
  }

  getDescSuccess(){
    if(this.desc_devis.valid){
      return true;
    }
  }

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
