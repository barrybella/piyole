import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToolsService } from './../services/tools.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

// Page "Nous contacter" : formulaire simple (nom, téléphone, message) permettant à
// un visiteur d'envoyer une demande générale à l'équipe Piyole.
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  etatPadding: boolean = false;
  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor(private fb: FormBuilder, private toolsService: ToolsService, private router: Router) { }

  ngOnInit(): void {
  }

  // Formulaire réactif : nom, téléphone (minimum 9 chiffres) et détail du message,
  // tous obligatoires.
  control_form = this.fb.group({
    "name": ['', [Validators.required]],
    "tel": ['', [Validators.required, Validators.pattern(/^[0-9+]{9,}$/)]],
    "detail": ['', [Validators.required]],
  });

  // Envoie le message de contact au backend, affiche une confirmation, puis
  // redirige vers la page d'accueil.
  onSubmit(){
    this.etatPadding = true;
    this.toolsService.addContact(this.control_form.value).subscribe(res => {
      Swal.fire("Envoyé", "Votre message est envoyé avec succès!!", "success");
      this.router.navigate(['/']);
    })
  }

  // Retourne le message d'erreur pour le champ nom s'il est vide.
  getNameError(){
    if(this.name.invalid && (this.name.dirty || this.name.touched)){
      if(this.name.errors.required){
        return "Le Nom est requis!!";
      }
    }
  }

  // Indique si le champ nom est valide (pour affichage visuel de succès).
  getNameSuccess(){
    if(this.name.valid){
      return true;
    }
  }

  // Retourne le message d'erreur pour le champ détail/message s'il est vide.
  getDescError(){
    if(this.detail.invalid && (this.detail.dirty || this.detail.touched)){
      if(this.detail.errors.required){
        return "Le detail est requis!!";
      }
    }
  }

  // Indique si le champ détail/message est valide (pour affichage visuel de succès).
  getDescSuccess(){
    if(this.detail.valid){
      return true;
    }
  }

  // Retourne le message d'erreur approprié pour le champ téléphone.
  getTelError(){
    if(this.tel.invalid && (this.tel.dirty || this.tel.touched)){
      if(this.tel.errors.required){
        return "Le telephone est requis!!";
      }else if(this.tel.errors.pattern){
        return 'Minimum 9 chiffres!!';
      }
    }
  }

  // Indique si le champ téléphone est valide (pour affichage visuel de succès).
  getTelSuccess(){
    if(this.tel.valid){
      return true;
    }
  }

  get name(){
    return this.control_form.get('name');
  }

  get tel(){
    return this.control_form.get('tel');
  }

  get detail(){
    return this.control_form.get('detail');
  }
}
