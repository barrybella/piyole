import { Post } from 'src/app/interfaces/post';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import { ContratService } from 'src/app/services/contrat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-chantier',
  templateUrl: './add-chantier.component.html',
  styleUrls: ['./add-chantier.component.css']
})
export class AddChantierComponent implements OnInit {
  etatPaading: boolean = false;
  contact: any;
  publication?: Post;
  contact_confirms: any[] = [];
  rendezvous: any[] = [];
  date_limit?: any = null;
  days: any[] = [];

  constructor(public dialogRef: MatDialogRef<AddChantierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private contratService: ContratService, private userService: UserService, private router: Router) { }

  /**
   * Initialise le composant et prépare les données nécessaires à son affichage.
   */
  ngOnInit(): void {
   this.getDays();
    
  }

  controlForm = this.fb.group({
    chantier: ['', [Validators.required]],
    description: ['', []],
    adress: ['', [Validators.required]],
    nb_month: ['Selectioner', [Validators.pattern(/^[0-9+]{1,}$/), selectionerValidator()]],
  });

  /**
   * Exécute le traitement associé à la méthode « onSubmit ». 
   */
  onSubmit(){
    this.etatPaading = true;

    this.contratService.addSuivie(this.controlForm.value).subscribe(res => {
      this.etatPaading = false;
      this.dialogRef.close();
      this.router.navigate(['contrats/contrat-suivie-chantier']);
      Swal.fire("Chantier Ajouté",'', 'success');
    })
    
  }

  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getDays(){
    for (var i = 1; i<= 200; i++) {
      this.days.push(i);
    }
  } 
  
  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getChantierError(){
    if(this.chantier.invalid && (this.chantier.dirty || this.chantier.touched)){
      if(this.chantier.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getChantierSuccess(){
    if(this.chantier.valid){
      return true;
    }
  }
  
  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getAdressError(){
    if(this.adress.invalid && (this.adress.dirty || this.adress.touched)){
      if(this.adress.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getAdressSuccess(){
    if(this.adress.valid){
      return true;
    }
  }
  
  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getNb_monthError(){
    if(this.nb_month.invalid && (this.nb_month.dirty || this.nb_month.touched)){
      if(this.nb_month.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  /**
   * Récupère les données nécessaires au traitement courant.
   */
  getNb_monthSuccess(){
    if(this.nb_month.valid){
      return true;
    }
  }

  get chantier() {
    return this.controlForm.get('chantier');
  }


  get adress() {
    return this.controlForm.get('adress');
  }

  get nb_month() {
    return this.controlForm.get('nb_month');
  }

  get description() {
    return this.controlForm.get('description');
  }

 


}
