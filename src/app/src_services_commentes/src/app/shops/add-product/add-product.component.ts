import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CompressImageService } from './../../services/compress-image.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { PrintService } from 'src/app/services/print.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import { UserService } from 'src/app/services/user.service';
import { property_id_piyole } from 'src/app/backend';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';
import { ToolsService } from 'src/app/services/tools.service';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  multiplesImages: any[] = [];
  fileData?: any;
  tables: any[] = [];
  tabs: any[] = [];
  users: any[] = [];
  categories: any[] = [];
  etatPadding?: boolean = false;
  ctrlImage?: boolean = true;

  constructor( private location: Location, private fb: FormBuilder, public print: PrintService, private userService: UserService, private shopService: ShopService, private compressImage: CompressImageService, private router: Router, private _snackBar: SnackBarService, private toolsService: ToolsService) { }

  ngOnInit(): void {
    this.getFournisseurs();
    this.getCatProduits();
  }

  getFournisseurs(){
    this.userService.getFournisseurs().subscribe(res => {
      this.users = res;
    })
  }

  getCatProduits(){
    this.toolsService.getCatProduits().subscribe(res => {
      this.categories = res;
    })
  }

  controlForm = this.fb.group({
    title: ['', [Validators.required]],
    entreprise_id: ['Selectioner', [Validators.required, selectionerValidator()]],
    categorie: ['Selectioner', [Validators.required, selectionerValidator()]],
    prix_global: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    desc: ['', [Validators.required]],
    use: ['', [Validators.required]],
    intro: ['', [Validators.required]],
    unite: ['',[Validators.required]],
    // marque: ['',[]],
    // size: ['',[]],
    // color: ['',[]],
    images: ['',],
    user_id: [''],
  });

  onSubmit(){
    this.user_id?.setValue(this.userService?.getUserDetails()._id);
    this.etatPadding = true;

    const formData = new FormData();
    
    for(let img of this.multiplesImages){
      formData.append('files', img);
    }

    this.shopService.upload(formData).subscribe(res => {
      this._snackBar.openSnackBar("Telechargment d'image en cours...", "");
      const partiesImages: string[] = res.map(url => url.slice(url.indexOf('/piyole-bucket.s3.eu-north-1.amazonaws.com/') + '/piyole-bucket.s3.eu-north-1.amazonaws.com/'.length));
       // Filtrer et trier les éléments commençant par "images/"
       let filteredTabs = partiesImages.filter(tab => tab.startsWith('images/'));

       // Filtrer et trier les éléments commençant par "images/WhatsApp"
       let whatsappTabs = partiesImages.filter(tab => tab.startsWith('images/WhatsApp'));
 
       // Fusionner les deux tableaux filtrés
       let sortedTabs = filteredTabs.concat(whatsappTabs);
      
       
       this.images?.setValue(sortedTabs);

       console.log("Images ", this.images.value);
      

      this.shopService.addProduct(this.controlForm.value).subscribe(res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Produit ajouté!',
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigate(['shops/products-liste']);

      });
      
    });

   
  }

  fileProgress(event){
    this.tables = [];
    let image: any = event.target.files
    
    for(var i=0; i< image.length; i++){
      if(image.length >= 5 && image.length <= 25){
        this.ctrlImage = false;
        this.compressImage.compress(image[i])
        .pipe(take(1))
        .subscribe(compressedImage => {
          this.tables.push(compressedImage);
          // now you can do upload the compressed image 
          if(event.target.files.length > 0){
            this.multiplesImages = this.tables.sort((a, b) => {
              let nameA = a.name.toLowerCase();
              let nameB = b.name.toLowerCase();
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
            });
          }
        })
      }else{
        Swal.fire("Impossible!!", "Vous ne pouvez ajouté que minimum 5 images et au maximum 25 images", "warning");
        this.ctrlImage = true;

      }
      
    }
  }

  getTitleEror(){
    if(this.title.invalid && (this.title.dirty || this.title.touched)){
      if(this.title.errors.required){
        return "Le titre est requis!!";
      }
    }
  }

  getTitleSuccess(){
    if(this.title.valid){
      return true;
    }
  }

  getUniteEror(){
    if(this.unite.invalid && (this.unite.dirty || this.unite.touched)){
      if(this.unite.errors.required){
        return "L'unitée est requise!!";
      }
    }
  }

  getUniteSuccess(){
    if(this.unite.valid){
      return true;
    }
  }

  getMarqueEror(){
    if(this.marque.invalid && (this.marque.dirty || this.marque.touched)){
      if(this.marque.errors.required){
        return "La marque est requise!!";
      }
    }
  }

  getMarqueSuccess(){
    if(this.marque.valid){
      return true;
    }
  }

  getSizeEror(){
    if(this.size.invalid && (this.size.dirty || this.size.touched)){
      if(this.size.errors.required){
        return "La taille est requise!!";
      }
    }
  }

  getSizeSuccess(){
    if(this.size.valid){
      return true;
    }
  }

  getColorEror(){
    if(this.color.invalid && (this.color.dirty || this.color.touched)){
      if(this.color.errors.required){
        return "La couleur est requise!!";
      }
    }
  }

  getColorSuccess(){
    if(this.color.valid){
      return true;
    }
  }

  getUseEror(){
    if(this.use.invalid && (this.use.dirty || this.use.touched)){
      if(this.use.errors.required){
        return "L'utilisation est requise!!";
      }else if(this.use.errors.minlength){
        return 'Minimun 200 caracteres!!';
      }
    }
  }

  getUseSuccess(){
    if(this.use.valid){
      return true;
    }
  }

  getEntrepriseEror(){
    if(this.entreprise_id.invalid && (this.entreprise_id.dirty || this.entreprise_id.touched)){
      if(this.entreprise_id.errors.required){
        return "L'entreprise est requise!!";
      }
    }
  }

  getEntrepriseSuccess(){
    if(this.entreprise_id.valid){
      return true;
    }
  }

  getPrixEror(){
    if(this.prix_global.invalid && (this.prix_global.dirty || this.prix_global.touched)){
      if(this.prix_global.errors.required){
        return "Le prix est requis!!";
      }
    }
  }

  getPrixSuccess(){
    if(this.prix_global.valid){
      return true;
    }
  }

  getDescriptionEror(){
    if(this.desc.invalid && (this.desc.dirty || this.desc.touched)){
      if(this.desc.errors.required){
        return "La description est requise!!";
      }else if(this.desc.errors.minlength){
        return 'Minimun 60 caracteres!!';
      }
    }
  }

  getDescriptionSuccess(){
    if(this.desc.valid){
      return true;
    }
  }

  getIntroEror(){
    if(this.intro.invalid && (this.intro.dirty || this.intro.touched)){
      if(this.intro.errors.required){
        return "L'introduction est requise!!";
      }else if(this.intro.errors.minlength){
        return 'Minimun 60 caracteres!!';
      }
    }
  }

  getIntroSuccess(){
    if(this.intro.valid){
      return true;
    }
  }

  get use(){
    return this.controlForm.get('use');
  }

  get size(){
    return this.controlForm.get('size');
  }

  get color(){
    return this.controlForm.get('color');
  }

  get title(){
    return this.controlForm.get('title');
  }

  get categorie(){
    return this.controlForm.get('categorie');
  }

  get prix_global(){
    return this.controlForm.get('prix_global');
  }

  get entreprise_id(){
    return this.controlForm.get('entreprise_id');
  }

  get marque(){
    return this.controlForm.get('marque');
  }

  get intro(){
    return this.controlForm.get('intro');
  }

  get desc(){
    return this.controlForm.get('desc');
  }

  get unite(){
    return this.controlForm.get('unite');
  }

  get user_id(){
    return this.controlForm.get('user_id');
  }

  get images(){
    return this.controlForm.get('images');
  }

  get slug_id(){
    return this.controlForm.get('slug_id');
  }

  onBack(){
    this.location.back();
  }
}
