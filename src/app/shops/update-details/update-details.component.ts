import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { PostService } from 'src/app/services/post.service';
import { ShopService } from 'src/app/services/shop.service';
import { UserService } from 'src/app/services/user.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import Swal from 'sweetalert2';

// Formulaire de modification d'un détail existant (titre + description), pré-rempli
// avec les valeurs actuelles.
@Component({
  selector: 'app-update-details',
  templateUrl: './update-details.component.html',
  styleUrls: ['./update-details.component.css']
})
export class UpdateDetailsComponent implements OnInit {
  detail?: any;
  id?: any;
  etatPadding: boolean = false;
  countries: any[] = [];
  print_countries: boolean = false;

  constructor(public dialogRef: MatDialogRef<UpdateDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private shopService: ShopService) { }

  // Récupère le détail à modifier et l'identifiant de la boutique parente,
  // puis pré-remplit le formulaire.
  ngOnInit() {
    this.detail = this.data.detail;
    this.id = this.data.id;
    this.initialiseForms();
  }

  // Formulaire réactif : titre et description, tous deux obligatoires.
  controlForm = this.fb.group({
    title: ['', {
      validators: [
      Validators.required
    ]}
    ],
    desc: ['', {
      validators: [
      Validators.required
    ]}
    ]
  });


  // Met à jour le détail auprès du backend, affiche une confirmation et ferme
  // la boîte de dialogue.
  onSubmit(){
    this.etatPadding = true; 
    this.shopService.updateDetails(this.id, this.detail._id, this.controlForm.value).subscribe(res => {
      Swal.fire("Ajouté!!", "Detail ajouté avec succès!!", "success");
      this.dialogRef.close();
    })
  }

  // Pré-remplit le formulaire avec les valeurs actuelles du détail.
  private initialiseForms(){
    this.controlForm.patchValue({
      title: this.detail?.title ? this.detail?.title : '',
      desc: this.detail?.desc ? this.detail?.desc : '',
    });
  }

  // Retourne le message d'erreur pour le champ titre s'il est vide.
  getTitleError(){
    if(this.title.invalid && (this.title.dirty || this.title.touched)){
      if(this.title.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  // Indique si le champ titre est valide (pour affichage visuel de succès).
  getTitleSuccess(){
    if(this.title.valid){
      return true;
    }
  }

  // Retourne le message d'erreur pour le champ description s'il est vide.
  getDescError(){
    if(this.desc.invalid && (this.desc.dirty || this.desc.touched)){
      if(this.desc.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  // Indique si le champ description est valide (pour affichage visuel de succès).
  getDescSuccess(){
    if(this.desc.valid){
      return true;
    }
  }


  get title(){
    return this.controlForm.get('title');
  }

  get desc(){
    return this.controlForm.get('desc');
  }

}
