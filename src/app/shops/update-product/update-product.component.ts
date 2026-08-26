import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
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

// Formulaire de modification d'un produit existant : quasiment identique à
// AddProductComponent, mais charge d'abord le produit existant pour pré-remplir
// le formulaire, et appelle updateShop plutôt qu'addProduct à la soumission.
@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  shop: any;
  multiplesImages: any[] = [];
  fileData?: any;
  tables: any[] = [];
  tabs: any[] = [];
  users: any[] = [];
  categories: any[] = [];
  etatPadding?: boolean = false;
  ctrlImage?: boolean = false;

  // Méthode constructor : gère la logique métier associée à cette opération.
  constructor( private location: Location, private fb: FormBuilder, public print: PrintService, private userService: UserService, private shopService: ShopService, private compressImage: CompressImageService, private router: Router, private _snackBar: SnackBarService, private toolsService: ToolsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getShopById();
    this.getFournisseurs();
    this.getCatProduits();
  }

  // Récupère le produit à modifier via l'identifiant présent dans l'URL, puis
  // pré-remplit le formulaire avec ses valeurs actuelles.
  getShopById(){
    const id = this.route.snapshot.paramMap.get('id');

    this.shopService.getShopById(id).subscribe(res => {
      this.shop = res;
      this.initialiseForms();
    })
  }

  // Récupère la liste des fournisseurs, pour le champ "entreprise" du formulaire.
  getFournisseurs(){
    this.userService.getFournisseurs().subscribe(res => {
      this.users = res;
    })
  }

  // Récupère la liste des catégories de produits disponibles.
  getCatProduits(){
    this.toolsService.getCatProduits().subscribe(res => {
      this.categories = res;
    })
  }

  // Formulaire réactif, identique à celui de AddProductComponent (titre,
  // fournisseur, catégorie, prix, description, utilisation, introduction, unité, images).
  controlForm = this.fb.group({
    title: ['', [Validators.required]],
    entreprise_id: ['Selectioner', [Validators.required, selectionerValidator()]],
    categorie: ['Selectioner', [Validators.required, selectionerValidator()]],
    prix_global: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    desc: ['', [Validators.required]],
    intro: ['', [Validators.required]],
    use: ['', [Validators.required]],
    unite: ['',[Validators.required]],
    // marque: ['',[]],
    // size: ['',[]],
    // color: ['',[]],
    images: ['',],
  });


  // Pré-remplit le formulaire avec les valeurs actuelles du produit.
  private initialiseForms(){
    this.controlForm.patchValue({
      title: this.shop?.title ? this.shop?.title : '',
      entreprise_id: this.shop?.entreprise_id ? this.shop?.entreprise_id : '',
      categorie: this.shop?.categorie ? this.shop?.categorie : '',
      desc: this.shop?.desc ? this.shop?.desc : '',
      intro: this.shop?.intro ? this.shop?.intro : '',
      prix_global: this.shop?.prix_global ? this.shop?.prix_global : '',
      use: this.shop?.use ? this.shop?.use : '',
      unite: this.shop?.unite ? this.shop?.unite : '',
      marque: this.shop?.marque ? this.shop?.marque : '',
      size: this.shop?.size ? this.shop?.size : '',
      color: this.shop?.color ? this.shop?.color : '',
    });
  }

  // Si de nouvelles images ont été sélectionnées, les téléverse et extrait/trie
  // leurs chemins relatifs (mêmes logique et remarque que dans AddProductComponent),
  // puis met à jour le produit avec les valeurs du formulaire.
  onSubmit(){
    const id = this.route.snapshot.paramMap.get('id');
    this.user_id?.setValue(this.userService?.getUserDetails()._id);
    this.etatPadding = true;

    const formData = new FormData();
    
    for(let img of this.multiplesImages){
      formData.append('files', img);
    }

    this.shopService.upload(formData).subscribe(res => {

      const partiesImages: string[] = res.map(url => url.slice(url.indexOf('/piyole-bucket.s3.eu-north-1.amazonaws.com/') + '/piyole-bucket.s3.eu-north-1.amazonaws.com/'.length));
       // Filtrer et trier les éléments commençant par "images/"
       let filteredTabs = partiesImages.filter(tab => tab.startsWith('images/'));

       // Filtrer et trier les éléments commençant par "images/WhatsApp"
       let whatsappTabs = partiesImages.filter(tab => tab.startsWith('images/WhatsApp'));
 
       // Fusionner les deux tableaux filtrés
       let sortedTabs = filteredTabs.concat(whatsappTabs);
      
       
       this.images?.setValue(sortedTabs);

      

      this.shopService.updateShop(id, this.controlForm.value).subscribe(res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Midification Reuissie!!!',
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigate(['shops/products-liste']);

      });
      
    });

   
  }

  // Déclenché à la sélection de nouvelles images : exige entre 5 et 25 fichiers,
  // les compresse, puis trie la liste finale par ordre alphabétique de nom de fichier.
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

  // Retourne le message d'erreur pour le champ titre s'il est vide.
  getTitleEror(){
    if(this.title.invalid && (this.title.dirty || this.title.touched)){
      if(this.title.errors.required){
        return "Le titre est requis!!";
      }
    }
  }

  // Indique si le champ titre est valide (pour affichage visuel de succès).
  getTitleSuccess(){
    if(this.title.valid){
      return true;
    }
  }

  // Retourne le message d'erreur pour le champ unité s'il est vide.
  getUniteEror(){
    if(this.unite.invalid && (this.unite.dirty || this.unite.touched)){
      if(this.unite.errors.required){
        return "L'unitée est requise!!";
      }
    }
  }

  // Indique si le champ unité est valide (pour affichage visuel de succès).
  getUniteSuccess(){
    if(this.unite.valid){
      return true;
    }
  }

  // Retourne le message d'erreur pour le champ marque s'il est vide.
  getMarqueEror(){
    if(this.marque.invalid && (this.marque.dirty || this.marque.touched)){
      if(this.marque.errors.required){
        return "La marque est requise!!";
      }
    }
  }

  // Indique si le champ marque est valide (pour affichage visuel de succès).
  getMarqueSuccess(){
    if(this.marque.valid){
      return true;
    }
  }

  // Retourne le message d'erreur pour le champ taille s'il est vide.
  getSizeEror(){
    if(this.size.invalid && (this.size.dirty || this.size.touched)){
      if(this.size.errors.required){
        return "La taille est requise!!";
      }
    }
  }

  // Indique si le champ taille est valide (pour affichage visuel de succès).
  getSizeSuccess(){
    if(this.size.valid){
      return true;
    }
  }

  // Retourne le message d'erreur pour le champ couleur s'il est vide.
  getColorEror(){
    if(this.color.invalid && (this.color.dirty || this.color.touched)){
      if(this.color.errors.required){
        return "La couleur est requise!!";
      }
    }
  }

  // Indique si le champ couleur est valide (pour affichage visuel de succès).
  getColorSuccess(){
    if(this.color.valid){
      return true;
    }
  }

  // Retourne le message d'erreur approprié pour le champ utilisation.
  getUseEror(){
    if(this.use.invalid && (this.use.dirty || this.use.touched)){
      if(this.use.errors.required){
        return "L'utilisation est requise!!";
      }else if(this.use.errors.minlength){
        return 'Minimun 200 caracteres!!';
      }
    }
  }

  // Indique si le champ utilisation est valide (pour affichage visuel de succès).
  getUseSuccess(){
    if(this.use.valid){
      return true;
    }
  }

  // Retourne le message d'erreur pour le champ entreprise/fournisseur s'il est vide.
  getEntrepriseEror(){
    if(this.entreprise_id.invalid && (this.entreprise_id.dirty || this.entreprise_id.touched)){
      if(this.entreprise_id.errors.required){
        return "L'entreprise est requise!!";
      }
    }
  }

  // Indique si le champ entreprise/fournisseur est valide (pour affichage visuel de succès).
  getEntrepriseSuccess(){
    if(this.entreprise_id.valid){
      return true;
    }
  }

  // Retourne le message d'erreur pour le champ prix s'il est vide.
  getPrixEror(){
    if(this.prix_global.invalid && (this.prix_global.dirty || this.prix_global.touched)){
      if(this.prix_global.errors.required){
        return "Le prix est requis!!";
      }
    }
  }

  // Indique si le champ prix est valide (pour affichage visuel de succès).
  getPrixSuccess(){
    if(this.prix_global.valid){
      return true;
    }
  }

  // Retourne le message d'erreur approprié pour le champ description.
  getDescriptionEror(){
    if(this.desc.invalid && (this.desc.dirty || this.desc.touched)){
      if(this.desc.errors.required){
        return "La description est requise!!";
      }else if(this.desc.errors.minlength){
        return 'Minimun 60 caracteres!!';
      }
    }
  }

  // Indique si le champ description est valide (pour affichage visuel de succès).
  getDescriptionSuccess(){
    if(this.desc.valid){
      return true;
    }
  }

  // Retourne le message d'erreur approprié pour le champ introduction.
  getIntroEror(){
    if(this.intro.invalid && (this.intro.dirty || this.intro.touched)){
      if(this.intro.errors.required){
        return "L'introduction est requise!!";
      }else if(this.intro.errors.minlength){
        return 'Minimun 60 caracteres!!';
      }
    }
  }

  // Indique si le champ introduction est valide (pour affichage visuel de succès).
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

  get intro(){
    return this.controlForm.get('intro');
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

  // Retourne à la page précédente dans l'historique de navigation.
  onBack(){
    this.location.back();
  }

}
