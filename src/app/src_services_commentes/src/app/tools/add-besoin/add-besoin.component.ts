import { JsService } from './../../services/js.service';
import { ToolsService } from './../../services/tools.service';
import { PrintService } from 'src/app/services/print.service';
import { PostService } from 'src/app/services/post.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-besoin',
  templateUrl: './add-besoin.component.html',
  styleUrls: ['./add-besoin.component.css']
})
export class AddBesoinComponent implements OnInit {
  post?: any;
  communes: any[] = [];
  quartiers: any[] = [];
  etatPadding: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, public dialogRef: MatDialogRef<AddBesoinComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private toolsService: ToolsService, private userService: UserService, public print: PrintService, private js: JsService) { }

  ngOnInit(): void {
    this.js.jsBesoin();

    this.getCommunes();
    this.getQuartiers();
  }

  controlForm = this.fb.group({
    name: ['', [Validators.required]],
    tel: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[0-9+]{1,}$/)]],
    categorie: ['', [Validators.required]],
    type_post: ['', [Validators.required]],
    commune: ['', [Validators.required]],
    quartier: ['', [Validators.required]],
    prix_min: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/),]],
    prix_max: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/),]],
    detail: ['', []],
  });

  onSubmit(){
    this.etatPadding = true;
    // console.log('CONTROL FORM ', this.controlForm.value);
    if((+this.prix_max.value) < (+this.prix_min.value)){
      Swal.fire({
        icon: 'warning',
        title: 'Impossible!!',
        text: 'Le prix minimal ne doit pas être inferieur au prix minimal!!',
      });
      this.etatPadding = false;
      return;
    }else{
      console.log("LOG CONTROL FORM ", this.controlForm.value);
      
      this.toolsService.addBesoin(this.controlForm.value).subscribe(result => {
        Swal.fire({
          icon: 'success',
          title: 'Enregistré!!',
          text: 'Nous prenons en compte votre besoin et nous vous contacterons dams les plus bref delais, Merci!!',
        });
        this.dialogRef.close();
      })
    }
  }

  getCommunes(){
    this.toolsService.getCommunes().subscribe(res => {
      this.communes = res;
    })
  }

  getQuartiers(){
    this.toolsService.getQuartiers().subscribe(res => {
      this.quartiers = res;
    })
  }

  getCategorieError(){
    if(this.categorie.invalid && (this.categorie.dirty || this.categorie.touched)){
      if(this.categorie.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  getCategorieSuccess(){
    if(this.categorie.valid){
      return true;
    }
  }

  getTypePostError(){
    if(this.type_post.invalid && (this.type_post.dirty || this.type_post.touched)){
      if(this.type_post.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  getTypePostSuccess(){
    if(this.type_post.valid){
      return true;
    }
  }

  getQuartierError(){
    if(this.quartier.invalid && (this.quartier.dirty || this.quartier.touched)){
      if(this.quartier.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  getQuartierSuccess(){
    if(this.quartier.valid){
      return true;
    }
  }

  getCommuneError(){
    if(this.commune.invalid && (this.commune.dirty || this.commune.touched)){
      if(this.commune.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  getCommuneSuccess(){
    if(this.commune.valid){
      return true;
    }
  }

  getNameError(){
    if(this.name.invalid && (this.name.dirty || this.name.touched)){
      if(this.name.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  getNameSuccess(){
    if(this.name.valid){
      return true;
    }
  }

  getTelError(){
    if(this.tel.invalid && (this.tel.dirty || this.tel.touched)){
      if(this.tel.errors.required){
        return "Le telephone est requis!!";
      }else if(this.tel.errors.minlength){
        return 'Trop petit!!';
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
  
  getPrixMinError(){
    if(this.prix_min.invalid && (this.prix_min.dirty || this.prix_min.touched)){
      if(this.prix_min.errors.required){
        return "Le prix minimal est requis!!";
      }else if(this.prix_min.errors.pattern){
        return 'Montant incorect!!';
      }
    }
  }

  getPrixMinSuccess(){
    if(this.prix_min.valid){
      return true;
    }
  }

  getpPrixMaxError(){
    if(this.prix_max.invalid && (this.prix_max.dirty || this.prix_max.touched)){
      if(this.prix_max.errors.required){
        return "Le prix maximal est requis!!";
      }else if(this.prix_max.errors.pattern){
        return 'Montant incorect!!';
      }
    }
  }

  getpPrixMaxSuccess(){
    if(this.prix_max.valid){
      return true;
    }
  }


  get name(){
    return this.controlForm.get('name');
  }

  get categorie(){
    return this.controlForm.get('categorie');
  }

  get type_post(){
    return this.controlForm.get('type_post');
  }

  get tel(){
    return this.controlForm.get('tel');
  }

  get commune(){
    return this.controlForm.get('commune');
  }

  get quartier(){
    return this.controlForm.get('quartier');
  }

  get prix_min(){
    return this.controlForm.get('prix_min');
  }

  get prix_max(){
    return this.controlForm.get('prix_max');
  }

}
