import { Post } from './../../interfaces/post';
import { take } from 'rxjs';
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

@Component({
  selector: 'app-update-terrain',
  templateUrl: './update-terrain.component.html',
  styleUrls: ['./update-terrain.component.css']
})
export class UpdateTerrainComponent implements OnInit {
  etatPadding: boolean = false;
  ctrlImage: boolean = false;

  nivauxEtageRequired: boolean = false;
  avanceRequired: boolean = false;
  periodeRequired: boolean = false;
  tempsRequired: boolean = false;

  colValEtage: number = 6;
  champNiveauxEtage: boolean = false;

  hiddenStatus: boolean = false;

  communes: any[] = [];
  quartiers: any[] = [];
  quartierFileters: any[] = [];
  select_commune: boolean = false;

  multiplesImages: any[] = [];
  fileData?: any;
  tables: any[] = [];
  tabs: any[] = [];

  post: Post

  /**
   * Initialise le composant et injecte les dépendances nécessaires.
   */
  constructor(private postService: PostService, private fb: FormBuilder, private userService: UserService, private _snackBar: MatSnackBar, private location: Location, private router: Router, public print: PrintService, private toolsService: ToolsService, private compressImage: CompressImageService, private route: ActivatedRoute) { }

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
      this.initialiseForms();
      this.getQuartiers();

    })
  }

  controlForm = this.fb.group({
    title: ['', [Validators.required]],
    categorie: ['Terrain', []],
    lotissement: ['Selectioner', [Validators.required,selectionerValidator()]],
    terassement: ['Selectioner', [Validators.required,selectionerValidator()]],
    prix: [0, []],
    mettreCaree: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    cour: ['Selectioner', [selectionerValidator()]],
    // gardien: ['Selectioner', [selectionerValidator()]],
    region: ['Selectioner', [selectionerValidator()]],
    commune: ['Selectioner', [selectionerValidator()]],
    quartier: ['Selectioner', [selectionerValidator()]],
    discut: ['Selectioner', [selectionerValidator()]],
    type: [1],
    secteur: ['', []],
    description: ['', [Validators.required]],
    fournisseur: ['0', []],
    active: [false ],
    doc: ['',[Validators.required]],
    partner: ['', []],
    from: ['',],
    ing: [false],
    images: ['',[]],
   
  });

  /**
   * Initialise et configure les formulaires réactifs du composant.
   */
  private initialiseForms(){
    this.controlForm.patchValue({
      title: this.post?.title ? this.post?.title : '',
      mettreCaree: this.post?.mettreCaree ? this.post?.mettreCaree : '',
      prix: this.post?.prix ? this.post?.prix : '',
      doc: this.post?.doc ? this.post?.doc : '',
      partner: this.post?.partner ? this.post?.partner : '',
      cour: this.post?.cour ? 1 : 0,
      region: this.post?.region ? this.post?.region : '',
      commune: this.post?.commune ? this.post?.commune : '',
      quartier: this.post?.quartier ? this.post?.quartier : '',
      secteur: this.post?.secteur ? this.post?.secteur : '',
      description: this.post?.description ? this.post?.description : '',
      lotissement: this.post?.lotissement ? 1 : 0,
      terassement: this.post?.terassement ? 1 : 0,
      discut: this.post?.discut ? 1 : 0,
   
    });
  }

  /**
   * Traite la progression et les informations du fichier sélectionné.
   */
  fileProgress(event){
    this.tables = [];
    let image: any = event.target.files;
    
    for(var i=0; i< image.length; i++){
      if(image.length >= 5 && image.length <= 25){
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
   * Valide les données du formulaire et déclenche le traitement de soumission.
   */
  onSubmit() {
    var id = this.route.snapshot.paramMap.get('id');

    this.etatPadding = true;

    const formData = new FormData();
    
    for(let img of this.multiplesImages){
      formData.append('files', img);
    }

    this.postService.upload(formData).subscribe(res => {
      console.log("BEFORE ", res);
      const partiesImages: string[] = res.map(url => url.slice(url.indexOf('/piyole-bucket.s3.eu-north-1.amazonaws.com/') + '/piyole-bucket.s3.eu-north-1.amazonaws.com/'.length));
       // Filtrer et trier les éléments commençant par "images/"
       let filteredTabs = partiesImages.filter(tab => tab.startsWith('images/'));

       // Filtrer et trier les éléments commençant par "images/WhatsApp"
       let whatsappTabs = partiesImages.filter(tab => tab.startsWith('images/WhatsApp'));
 
       // Fusionner les deux tableaux filtrés
       let sortedTabs = filteredTabs.concat(whatsappTabs);
       this.images?.setValue(sortedTabs);
       this.postService.updatePost(id, this.controlForm.value).subscribe(res => {
        this.etatPadding = false;
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

  get meuble() {
    return this.controlForm.get('meuble');
  }

  get user_id() {
    return this.controlForm.get('user_id');
  }

  get categorie() {
    return this.controlForm.get('categorie');
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

  get lotissement() {
    return this.controlForm.get('lotissement');
  }

  get eaux() {
    return this.controlForm.get('eaux');
  }

  get terassement() {
    return this.controlForm.get('terassement');
  }

  get garage() {
    return this.controlForm.get('garage');
  }

  get property_id() {
    return this.controlForm.get('property_id');
  }

  get slug_id() {
    return this.controlForm.get('slug_id');
  }

  get etat_bien() {
    return this.controlForm.get('etat_bien');
  }

  get images() {
    return this.controlForm.get('images');
  }

  /**
   * Revient à la page ou à l'étape précédente.
   */
  onBack(){
    this.location.back();
  }
}
