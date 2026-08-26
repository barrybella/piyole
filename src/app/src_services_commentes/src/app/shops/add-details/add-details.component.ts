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

@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.css']
})
export class AddDetailsComponent implements OnInit {
  shop?: any;
  etatPadding: boolean = false;
  countries: any[] = [];
  print_countries: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private shopService: ShopService) { }

  ngOnInit() {
    this.shop = this.data.shop;
  }

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


  onSubmit(){
    this.etatPadding = true; 
    this.shopService.addDetails(this.shop._id, this.controlForm.value).subscribe(res => {
      Swal.fire("Ajouté!!", "Detail ajouté avec succès!!", "success");
      this.dialogRef.close();
    })
  }

  getTitleError(){
    if(this.title.invalid && (this.title.dirty || this.title.touched)){
      if(this.title.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
  getTitleSuccess(){
    if(this.title.valid){
      return true;
    }
  }

  getDescError(){
    if(this.desc.invalid && (this.desc.dirty || this.desc.touched)){
      if(this.desc.errors.required){
        return 'Cet champs est requis!';
      }
    }
  }
  
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
