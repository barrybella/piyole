import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  user?: User;
  etatPadding: boolean = false;
  countries: any[] = [];
  print_countries: boolean = false;

  constructor(public dialogRef: MatDialogRef<ContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private route: ActivatedRoute, private postService: PostService, private userService: UserService, private http: HttpClient) { }

  ngOnInit() {
    this.print_countries = false;
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(
      (response) => {
        this.print_countries = true;
        this.countries = response.filter(resp => {
          return resp.translations.fra.common != 'Antarctique';
        });
        this.countries.sort((a, b) => a.name.common.localeCompare(b.translations.fra.common));
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  controlForm = this.fb.group({
    code: ['', {
      validators: [
      Validators.required
    ]}
    ],
    tel: ['', {
      validators: [
      Validators.required,
      Validators.pattern(/^[0-9+]{6,}$/)
    ]}
    ],
    message: [''],
    countrie: ['']
  });


  onSubmit(){
    this.etatPadding = true; 
    if(this.data.post.user_id.tel == this.tel?.value){
      Swal.fire(
        'Imposible !!',
        'C\'est vous qui avez posté, votre numero de telephone appartient à cet post!!',
        'warning'
      );
      this.etatPadding = false;
    }else{
        
    this.postService.testIfContactForPostByIdAndTel(this.data.post._id, this.tel.value).subscribe(result => { 
      if(result.message){
        this.etatPadding = false;
        Swal.fire(
          'Contact déjà reçu!!',
          'Votre contact a déjà été reçu et il est en cours de traitement!!!!',
          'warning'
        );
      }else{
        this.userService.telExist(this.tel.value).subscribe(resp => {
          if(resp){
            if(resp.role != 'user'){
              Swal.fire(
                'Telephone Incorect!!',
                'Cet numero de telephone est utilisé par un de nos agent ou un proprietaire de bien!!',
                'warning'
              );
              this.etatPadding = false;
              return;
            }else{
              this.contactMe();
            }
          }else{
            this.contactMe();
          }
        })   
        }
      })
    }
  
  }

  contactMe(){
    this.postService.setContactPost(this.data.post._id, this.controlForm.value).subscribe(res => {
      this.etatPadding = false;
      this.dialogRef.close();
      Swal.fire(
        'Contact Effectuer!',
        'Vous allez recevoir un message de confirmation, sinon veuillez vérifier votre numéro de téléphone !!',
        'success'
      );
    })
  }

  getTelError(){
    if(this.tel.invalid && (this.tel.dirty || this.tel.touched)){
      if(this.tel.errors.required){
        return "Le telephone est requis!!";
      }else if(this.tel.errors.minLength){
        return 'Minimun 9 chiffre!!';
      }else if(this.tel.errors.telExist){
        this.user = this.tel.errors.telExist.value;
        console.log('USER ', this.user); 
        this.tel.setErrors(null);                                                                                                                                                                                                                                                                                                                                                                                            
      }else if(this.tel.errors.codeErr){
        return 'Code telephone incorect!!';
      }else if(this.tel.errors.pattern){
        return 'Minimum 9 chiffres!!';
      }else if(this.tel.errors.telNotExist){
        this.user = null;
        return 'Cet numero de telephone n\'existe pas!!';
      }
    }
  }

  getTelSuccess(){
    if(this.tel.valid){
      return true;
    }
  }

  getCodeError(){
    if(this.code.invalid && (this.code.dirty || this.code.touched)){
      if(this.code.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  getCodeSuccess(){
    if(this.code.valid){
      return true;
    }
  }


  get code(){
    return this.controlForm.get('code');
  }

  get tel(){
    return this.controlForm.get('tel');
  }

  get message(){
    return this.controlForm.get('message');
  }
}
