import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Post } from './../../interfaces/post';
import { CompressImageService } from './../../services/compress-image.service';
import { ToolsService } from './../../services/tools.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PostService } from './../../services/post.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { property_id_piyole } from 'src/app/backend';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { PrintService } from 'src/app/services/print.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit {
  categorieRequired: boolean = false;
  regionRequired: boolean = false;
  communeRequired: boolean = false;
  quartierRequired: boolean = false;
  parkingRequired: boolean = false;
  meubleRequired: boolean = false;
  climatiseurRequired: boolean = false;
  courRequired: boolean = false;
  gardienRequired: boolean = false;
  chambreRequired: boolean = false;
  etageRequired: boolean = false;
  prixRequired: boolean = false;
  soleRequired: boolean = false;

  nivauxEtageRequired: boolean = false;
  avanceRequired: boolean = false;
  periodeRequired: boolean = false;
  tempsRequired: boolean = false;

  colValEtage: number = 4;
  champNiveauxEtage: boolean = false;

  communes: any[] = [];
  quartiers: any[] = [];
  quartierFileters: any[] = [];
  select_commune: boolean = false;

  multiplesImages: any[] = [];
  fileData?: any;
  tables: any[] = [];

  post?: Post;
  etatPaading: boolean = false;
  ctrlImage: boolean = false;


  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private postService: PostService, private fb: FormBuilder, private userService: UserService, private location: Location, private router: Router, public print: PrintService, private toolsService: ToolsService, private compressImage: CompressImageService, private route: ActivatedRoute, private _snackBar: SnackBarService) { }

  /**
   * Initialise le composant après la création de la vue et prépare les données nécessaires.
   */
  ngOnInit() {
    this.getCommunes();
    this.getQuartiers();
    this.getPost();
  }

  /**
   * Récupère les données de l'annonce à partir de son identifiant ou du contexte courant.
   */
  getPost(){
    var id = this.route.snapshot.paramMap.get('id');
    this.postService.getPost(id).subscribe(res => {
      this.post = res;
      this.getQuartiers();


      if(this.post?.avance == true){
        this.colValAvance = 4;
        this.champAvance = true;
  
        this.periode.setValidators([Validators.required, selectionerValidator()]);
        this.temps.setValidators([Validators.required, selectionerValidator()]);
  
        this.periode.updateValueAndValidity();
        this.temps.updateValueAndValidity();
      }else{
        this.colValAvance = 12;
        this.champAvance = false;
  
        this.periode.clearValidators();
        this.temps.clearValidators();
  
        this.periode.updateValueAndValidity();
        this.temps.updateValueAndValidity();
      }
      this.initialiseForms();
    })
  }

  controlForm = this.fb.group({
    title: ['', [Validators.required]],
    categorie: ['Selectioner', [Validators.required,selectionerValidator()]],
    chambre: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    prix: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    caution: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    salon: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    toilette: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    terrasse: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    cuisine: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    sole: ['Selectioner', [selectionerValidator()]],
    eaux: ['Selectioner', [selectionerValidator()]],
    sale_bain: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    sale_manger: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    garage: ['Selectioner', [selectionerValidator()]],
    condition: ['', []],
    nivauxEtage: ['Selectioner', []],
    avance: ['Selectioner', [selectionerValidator()]],
    parcking: ['Selectioner', [selectionerValidator()]],
    temps: ['Selectioner', [selectionerValidator()]],
    periode: ['Selectioner', [selectionerValidator()]],
    meuble: ['Selectioner', [selectionerValidator()]],
    climatiseur: ['Selectioner', [selectionerValidator()]],
    mettreCaree: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    cour: ['Selectioner', [selectionerValidator()]],
    gardien: ['Selectioner', [selectionerValidator()]],
    region: ['Selectioner', [selectionerValidator()]],
    commune: ['Selectioner', [selectionerValidator()]],
    quartier: ['Selectioner', [selectionerValidator()]],
    etage: ['Selectioner', [selectionerValidator()]],
    mode_payement: ['Selectioner', [selectionerValidator()]],
    nb_day_free: ['Selectioner', [selectionerValidator()]],
    type: [0],
    secteur: ['', []],
    description: ['', [Validators.required]],
    fournisseur: ['0', []],
    partner: ['', []],
    active: [false ],
    images: ['',],

  })

  tabs: any[] = [];

  /**
   * Valide les données du formulaire et déclenche le traitement de soumission.
   */
  onSubmit() {
    var id = this.route.snapshot.paramMap.get('id');
    this.etatPaading = true;
    const formData = new FormData();

    for(let img of this.multiplesImages){
      formData.append('files', img);
    }

    this.postService.upload(formData).subscribe(res => {
      this._snackBar.openSnackBar("Telechargement d'image en cour...", "");
      
      const partiesImages: string[] = res.map(url => url.slice(url.indexOf('/piyole-bucket.s3.eu-north-1.amazonaws.com/') + '/piyole-bucket.s3.eu-north-1.amazonaws.com/'.length));
       // Filtrer et trier les éléments commençant par "images/"
       let filteredTabs = partiesImages.filter(tab => tab.startsWith('images/'));

       // Filtrer et trier les éléments commençant par "images/WhatsApp"
       let whatsappTabs = partiesImages.filter(tab => tab.startsWith('images/WhatsApp'));
 
       // Fusionner les deux tableaux filtrés
       let sortedTabs = filteredTabs.concat(whatsappTabs);
      
       
       this.images?.setValue(sortedTabs);

       console.log("Images ", this.images.value);

      this.postService.updatePost(id, this.controlForm.value).subscribe(res => {
        this.etatPaading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Post Modifié!',
          showConfirmButton: false,
          timer: 2000
        })
        this.location.back()
      });
      
    });
  }

  /**
   * Initialise et configure les formulaires réactifs du composant.
   */
  private initialiseForms(){
    this.controlForm.patchValue({
      title: this.post?.title ? this.post?.title : '',
      categorie: this.post?.categorie ? this.post?.categorie : '',
      eaux: this.post?.eaux ? this.post?.eaux : '',
      partner: this.post?.partner ? this.post?.partner : '',
      sale_bain: this.post?.sale_bain ? this.post?.sale_bain : '',
      sale_manger: this.post?.sale_manger ? this.post?.sale_manger : '',
      nb_day_free: this.post?.nb_day_free ? this.post?.nb_day_free : '',
      mode_payement: this.post?.mode_payement ? 1 : 0,
      garage: this.post?.garage ? 1 : 0,
      chambre: this.post?.chambre ? this.post?.chambre : '',
      salon: this.post?.salon ? this.post?.salon : '',
      toilette: this.post?.toilette ? this.post?.toilette : '',
      couloir: this.post?.couloir ? this.post?.couloir : '',
      terrasse: this.post?.terrasse ? this.post?.terrasse : '',
      cuisine: this.post?.cuisine ? this.post?.cuisine : '',
      sole: this.post?.sole ? this.post?.sole : '',
      parcking: this.post?.parcking ? 1 : 0,
      meuble: this.post?.meuble ? 1 : 0,
      climatiseur: this.post?.climatiseur ? 1 : 0,
      mettreCaree: this.post?.mettreCaree ? this.post?.mettreCaree : '',
      prix: this.post?.prix ? this.post?.prix : '',
      avance: this.post?.avance ? 1 : 0,
      periode: this.post?.periode ? this.post?.periode : '',
      caution: this.post?.caution ? this.post?.caution : '',
      temps: this.post?.temps ? this.post?.temps : '',
      cour: this.post?.cour ? 1 : 0,
      etage: this.post?.etage ? 1 : 0,
      gardien: this.post?.gardien ? 1 : 0,
      region: this.post?.region ? this.post?.region : '',
      nivauxEtage: this.post?.nivauxEtage ? this.post?.nivauxEtage : '',
      commune: this.post?.commune ? this.post?.commune : '',
      quartier: this.post?.quartier ? this.post?.quartier : '',
      secteur: this.post?.secteur ? this.post?.secteur : '',
      description: this.post?.description ? this.post?.description : '',
      condition: this.post?.condition ? this.post?.condition : '',
   
    });

    if(this.post?.etage){
      this.colValEtage = 3;
      this.champNiveauxEtage = true;
    }else{
      this.colValEtage = 4;
      this.champNiveauxEtage = false;
    }

    if(this.post?.avance){
      this.colValAvance = 4;
      this.champAvance = true;
    }else{
      this.colValAvance = 12;
      this.champAvance = false;
    }
  }

  /**
   * Traite la progression et les informations du fichier sélectionné.
   */
  fileProgress(event){
    this.tables = [];
    let image: any = event.target.files;
    
    for(var i=0; i< image.length; i++){
        this.ctrlImage = false;
        this.compressImage.compress(image[i])
        .pipe(take(1))
        .subscribe(compressedImage => {
          this.tables.push(compressedImage);
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
    }
  }
  fileDataVideo?: any;

  /**
   * Traite la progression du téléversement de la vidéo.
   */
  fileVideoProgress(event){
    this.fileDataVideo = <File>event.target.files[0];

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.controlForm.get('video').setValue(file);
      console.log("VIDEOS FILE ", this.video.value);
      

    }
  }

  /**
   * Gère le changement de valeur d'un champ ou d'une sélection.
   */
  changeEvent(event){
    var eventValue = event.target.value;
    if(eventValue == 1){
      this.colValEtage = 3;
      this.champNiveauxEtage = true;

      this.nivauxEtage.setValidators([Validators.required, selectionerValidator()]);
      this.nivauxEtage.updateValueAndValidity();
    }else{
      this.colValEtage = 4;
      this.champNiveauxEtage = false;

      this.nivauxEtage.clearValidators();
      this.nivauxEtage.updateValueAndValidity();
    }
  }

  colValAvance: number = 12;
  champAvance: boolean = false;

  /**
   * Gère la modification des critères de recherche ou des paramètres avancés.
   */
  changeEventAvance(event){
    var eventValue = event.target.value;
    if(eventValue == 1){
      this.colValAvance = 4;
      this.champAvance = true;

      this.periode.setValidators([Validators.required, selectionerValidator()]);
      this.temps.setValidators([Validators.required, selectionerValidator()]);

      this.periode.updateValueAndValidity();
      this.temps.updateValueAndValidity();
    }else{
      this.colValAvance = 12;
      this.champAvance = false;

      this.periode.clearValidators();
      this.temps.clearValidators();

      this.periode.updateValueAndValidity();
      this.temps.updateValueAndValidity();
    }
  }

  /**
   * Gère le changement de commune et met à jour les données dépendantes.
   */
  eventChangeCommune(event: any){
    this.select_commune = true;
    this.quartierFileters = [];
    var commune = event.target.value;

    this.quartierFileters = this.quartiers.filter(resp => {
      return resp.commune == commune;
    })
  }

  /**
   * Gère un changement dans les valeurs du formulaire ou les critères sélectionnés.
   */
  eventChange(event: any){
    if(event.target.value == 1){
      this.nb_day_free.setValue('Selectioner');

      this.nb_day_free.setValidators([Validators.required, selectionerValidator()]);
      this.nb_day_free.updateValueAndValidity();
    }else{
      this.nb_day_free.setValue('Selectioner');
      
      this.nb_day_free.setValidators([Validators.required, selectionerValidator()]);
      this.nb_day_free.updateValueAndValidity();
    }
  }

  /**
   * Récupère la liste des communes disponibles.
   */
  getCommunes(){
    this.toolsService.getCommunes().subscribe(res => {
      this.communes = res;
    })
  }

  /**
   * Récupère les quartiers associés à la commune sélectionnée.
   */
  getQuartiers(){
    this.toolsService.getQuartiers().subscribe(res => {
      this.quartiers = res;

      this.quartierFileters = this.quartiers.filter(resp => {
        return resp.commune == this.post?.commune;
      })
    })
  }

  get sale_bain() {
    return this.controlForm.get('sale_bain');
  }

  get sale_manger() {
    return this.controlForm.get('sale_manger');
  }

  get sole() {
    return this.controlForm.get('sole');
  }

  get cour() {
    return this.controlForm.get('cour');
  }

  get chambre() {
    return this.controlForm.get('chambre');
  }

  get gardien() {
    return this.controlForm.get('gardien');
  }

  get climatiseur() {
    return this.controlForm.get('climatiseur');
  }

  get mode_payement() {
    return this.controlForm.get('mode_payement');
  }

  get meuble() {
    return this.controlForm.get('meuble');
  }

  get user_id() {
    return this.controlForm.get('user_id');
  }

  get categorie() {
    return this.controlForm.get('categorie');
  }

  get slug_id() {
    return this.controlForm.get('slug_id');
  }

  get type() {
    return this.controlForm.get('type');
  }

  get region() {
    return this.controlForm.get('region');
  }

  get commune() {
    return this.controlForm.get('commune');
  }

  get quartier() {
    return this.controlForm.get('quartier');
  }

  get parcking() {
    return this.controlForm.get('parcking');
  }

  get nivauxEtage() {
    return this.controlForm.get('nivauxEtage');
  }

  get prix() {
    return this.controlForm.get('prix');
  }

  get etage() {
    return this.controlForm.get('etage');
  }

  get avance() {
    return this.controlForm.get('avance');
  }

  get periode() {
    return this.controlForm.get('periode');
  }

  get temps() {
    return this.controlForm.get('temps');
  }

  get eaux() {
    return this.controlForm.get('eaux');
  }

  get property_id() {
    return this.controlForm.get('property_id');
  }

  get nb_day_free() {
    return this.controlForm.get('nb_day_free');
  }

  get images(){
    return this.controlForm.get('images');
  }

  get video(){
    return this.controlForm.get('video');
  }

  /**
   * Revient à la page ou à l'étape précédente.
   */
  onBack(){
    this.location.back();
  }
}
