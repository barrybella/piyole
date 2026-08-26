import { SnackBarService } from 'src/app/services/snack-bar.service';
import { take } from 'rxjs';
import { CompressImageService } from './../../services/compress-image.service';
import { ToolsService } from './../../services/tools.service';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PostService } from './../../services/post.service';
import { Component, OnInit } from '@angular/core';
import { property_id_piyole } from 'src/app/backend';
import { selectionerValidator } from 'src/app/validators/selectioner.validator';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-add-terrain',
  templateUrl: './add-terrain.component.html',
  styleUrls: ['./add-terrain.component.css']
})
export class AddTerrainComponent implements OnInit {

  etatPadding: boolean = false;

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

  ctrlImage: boolean = true;

  constructor(private postService: PostService, private fb: FormBuilder, private userService: UserService, private _snackBar: SnackBarService, private location: Location, private router: Router, public print: PrintService, private toolsService: ToolsService, private compressImage: CompressImageService) { }

  ngOnInit() {
    this.getCommunes();
    this.getQuartiers();
  }

  controlForm = this.fb.group({
    title: ['', [Validators.required]],
    categorie: ['Terrain', []],
    lotissement: ['Selectioner', [Validators.required,selectionerValidator()]],
    terassement: ['Selectioner', [Validators.required,selectionerValidator()]],
    prix: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    mettreCaree: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    cour: ['Selectioner', [selectionerValidator()]],
    // gardien: ['Selectioner', [selectionerValidator()]],
    region: ['Selectioner', [selectionerValidator()]],
    commune: ['Selectioner', [selectionerValidator()]],
    quartier: ['Selectioner', [selectionerValidator()]],
    type: [1],
    discut: ['Selectioner', [selectionerValidator()]],
    secteur: ['', []],
    description: ['', [Validators.required]],
    fournisseur: ['0', []],
    delete: [0, []],
    active: [false ],
    property_id: ['',],
    from: ['',],
    doc: ['',[Validators.required]],
    partner: ['', []],
    ing: [false],
    images: ['',[]],
    user_id: ['',],
    slug_id: ['',],
  })

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

  onSubmit() {
    this.etatPadding = true;
    console.log("DOCUMENT ", this.controlForm.value);
    
    this.user_id.setValue(this.userService.getUserDetails()._id);
    this.slug_id.setValue(this.userService.getUserDetails().slug);
    this.property_id.setValue(property_id_piyole);

    const formData = new FormData();
    
    for(let img of this.multiplesImages){
      formData.append('files', img);
    }

    this.postService.upload(formData).subscribe(res => {
      this._snackBar.openSnackBar("Telechargment d'image en cours...", "");

      console.log("BEFORE ", res);
      const partiesImages: string[] = res.map(url => url.slice(url.indexOf('/piyole-bucket.s3.eu-north-1.amazonaws.com/') + '/piyole-bucket.s3.eu-north-1.amazonaws.com/'.length));
       // Filtrer et trier les éléments commençant par "images/"
       let filteredTabs = partiesImages.filter(tab => tab.startsWith('images/'));

       // Filtrer et trier les éléments commençant par "images/WhatsApp"
       let whatsappTabs = partiesImages.filter(tab => tab.startsWith('images/WhatsApp'));
 
       // Fusionner les deux tableaux filtrés
       let sortedTabs = filteredTabs.concat(whatsappTabs);
      
       
       this.images?.setValue(sortedTabs);

       console.log("Images ", this.images.value);

      this.postService.addPost(this.controlForm.value).subscribe(res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Post ajouté!',
          showConfirmButton: false,
          timer: 2000
        });
        this.etatPadding = false;
        this.router.navigate(['posts/dashboard'])
      });
    });
    
    
  }

  eventChangeCommune(event: any){
    this.select_commune = true;
    this.quartierFileters = [];
    var commune = event.target.value;

    this.quartierFileters = this.quartiers.filter(resp => {
      return resp.commune == commune;
    })
  }

  getCommunes(){
    this.toolsService.getCommunes().subscribe(res => {
      this.communes = res;
    })
  }

  getQuartiers(){
    this.toolsService.getQuartiers().subscribe(res => {
      this.quartiers = res;
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

  onBack(){
    this.location.back();
  }
}
