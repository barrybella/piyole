import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToolsService } from './../services/tools.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  etatPadding: boolean = false;
  constructor(private fb: FormBuilder, private toolsService: ToolsService, private router: Router) { }

  ngOnInit(): void {
  }

  control_form = this.fb.group({
    "name": ['', [Validators.required]],
    "tel": ['', [Validators.required, Validators.pattern(/^[0-9+]{9,}$/)]],
    "detail": ['', [Validators.required]],
  });

  onSubmit(){
    this.etatPadding = true;
    // console.log("CONTROL FORM ", this.control_form.value);
    this.toolsService.addContact(this.control_form.value).subscribe(res => {
      Swal.fire("Envoyé", "Votre message est envoyé avec succès!!", "success");
      this.router.navigate(['/']);
    })
  }

  getNameError(){
    if(this.name.invalid && (this.name.dirty || this.name.touched)){
      if(this.name.errors.required){
        return "Le Nom est requis!!";
      }
    }
  }

  getNameSuccess(){
    if(this.name.valid){
      return true;
    }
  }

  getDescError(){
    if(this.detail.invalid && (this.detail.dirty || this.detail.touched)){
      if(this.detail.errors.required){
        return "Le detail est requis!!";
      }
    }
  }

  getDescSuccess(){
    if(this.detail.valid){
      return true;
    }
  }

  getTelError(){
    if(this.tel.invalid && (this.tel.dirty || this.tel.touched)){
      if(this.tel.errors.required){
        return "Le telephone est requis!!";
      }else if(this.tel.errors.pattern){
        return 'Minimum 9 chiffres!!';
      }
    }
  }

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
