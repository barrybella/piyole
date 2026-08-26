import { CompressImageService } from './../../services/compress-image.service';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { PrintService } from 'src/app/services/print.service';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import { UserService } from 'src/app/services/user.service';
import { property_id_piyole } from 'src/app/backend';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-plan',
  templateUrl: './update-plan.component.html',
  styleUrls: ['./update-plan.component.css']
})
export class UpdatePlanComponent implements OnInit {
  plan: any;
  etatPaading: boolean = false;
  multiplesImages: any[] = [];
  fileData?: any;
  tables: any[] = [];
  tabs: any[] = [];
  ctrlImage?: boolean = false;


  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor( private location: Location, private fb: FormBuilder, public print: PrintService, private userService: UserService, private postService: PostService, private route: ActivatedRoute, private compressImage: CompressImageService) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit(): void {
    this.getPlan();
  }

  controlForm = this.fb.group({
    title: ['', [Validators.required]],
    categorie: ['Selectioner', [Validators.required, selectionerValidator()]],
    prix: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    description: ['', [Validators.required, Validators.minLength(60)]],
    type: ['2',],
    from: ['',],
    partner: ['', []],
    user_id: ['',],
    images: ['',],
    active: [false ],
    property_id: ['',],
  });

  /**
   * Valide les données du formulaire et déclenche le traitement de soumission.
   */
  onSubmit(){
    const id = this.route.snapshot.paramMap.get('id');
    this.etatPaading = true;

    const formData = new FormData();
    
    for(let img of this.multiplesImages){
      formData.append('files', img);
    }

    this.postService.upload(formData).subscribe(res => {
      console.log("BEFORE ", res);
      const partiesImages: string[] = res.map(url => url.slice(url.indexOf('/piyole-bucket.s3.eu-north-1.amazonaws.com/') + '/piyole-bucket.s3.eu-north-1.amazonaws.com/'.length));
       let filteredTabs = partiesImages.filter(tab => tab.startsWith('images/'));
       let whatsappTabs = partiesImages.filter(tab => tab.startsWith('images/WhatsApp'));
       let sortedTabs = filteredTabs.concat(whatsappTabs);
       this.images?.setValue(sortedTabs);
      this.postService.updatePost(id, this.controlForm.value).subscribe(res => {
        this.etatPaading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Plan Modifié!',
          showConfirmButton: false,
          timer: 2000
        })
        this.location.back();
      });
      
    });
  }

  /**
   * Traite la progression et les informations du fichier sélectionné.
   */
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
            });;
          }
        })
      }else{
        Swal.fire("Impossible!!", "Vous ne pouvez ajouté que minimum 5 images et au maximum 25 images", "warning");
        this.ctrlImage = true;

      }
      
    }
  }

  /**
   * Récupère les informations du plan à modifier.
   */
  getPlan(){
    const id = this.route.snapshot.paramMap.get('id');
    this.postService.getPost(id).subscribe(data => {
      this.plan = data;
      this.initialiseForms();
    })
  }

  /**
   * Initialise et configure les formulaires réactifs du composant.
   */
  private initialiseForms(){
    this.controlForm.patchValue({
      title: this.plan?.title ? this.plan?.title : '',
      partner: this.plan?.partner ? this.plan?.partner : '',
      categorie: this.plan?.categorie ? this.plan?.categorie : '',
      description: this.plan?.description ? this.plan?.description : '',
      prix: this.plan?.prix ? this.plan?.prix : '',
    });
  }

  /**
   * Retourne le message d'erreur lorsque le titre est invalide.
   */
  getTitleEror(){
    if(this.title.invalid && (this.title.dirty || this.title.touched)){
      if(this.title.errors.required){
        return "Le titew est requis!!";
      }
    }
  }

  /**
   * Retourne le message de validation lorsque le titre est valide.
   */
  getTitleSuccess(){
    if(this.title.valid){
      return true;
    }
  }

  /**
   * Retourne le message d'erreur lorsque le prix est invalide.
   */
  getPrixEror(){
    if(this.prix.invalid && (this.prix.dirty || this.prix.touched)){
      if(this.prix.errors.required){
        return "Le prix est requis!!";
      }
    }
  }

  /**
   * Retourne le message de validation lorsque le prix est valide.
   */
  getPrixSuccess(){
    if(this.prix.valid){
      return true;
    }
  }

  /**
   * Retourne le message d'erreur lorsque la description est invalide.
   */
  getDescriptionEror(){
    if(this.description.invalid && (this.description.dirty || this.description.touched)){
      if(this.description.errors.required){
        return "Le description est requise!!";
      }else if(this.description.errors.minlength){
        return 'Minimun 60 caracteres!!';
      }
    }
  }

  /**
   * Retourne le message de validation lorsque la description est valide.
   */
  getDescriptionSuccess(){
    if(this.description.valid){
      return true;
    }
  }

  get title(){
    return this.controlForm.get('title');
  }

  get images(){
    return this.controlForm.get('images');
  }

  get categorie(){
    return this.controlForm.get('categorie');
  }

  get prix(){
    return this.controlForm.get('prix');
  }

  get description(){
    return this.controlForm.get('description');
  }

  get property_id(){
    return this.controlForm.get('property_id');
  }

  get user_id(){
    return this.controlForm.get('user_id');
  }

  /**
   * Revient à la page ou à l'étape précédente.
   */
  onBack(){
    this.location.back();
  }
}
