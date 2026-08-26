import { SnackBarService } from 'src/app/services/snack-bar.service';
import { CompressImageService } from './../../services/compress-image.service';
import { ToolsService } from './../../services/tools.service';
import { Router } from '@angular/router';
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
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
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
  tabs: any[] = [];
  
  etatPadding: boolean = false;
  ctrlImage: boolean = true;

  constructor(private postService: PostService, private fb: FormBuilder, private userService: UserService, private _snackBar: SnackBarService, private location: Location, private router: Router, public print: PrintService, private toolsService: ToolsService, private compressImage: CompressImageService) { }

  ngOnInit() {
    this.getCommunes();
    this.getQuartiers();
  }

  controlForm = this.fb.group({
    title: ['', [Validators.required]],
    categorie: ['Selectioner', [Validators.required,selectionerValidator()]],
    chambre: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    prix: ['', [Validators.required, Validators.pattern(/^[0-9+]{1,}$/)]],
    caution: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    salon: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    toilette: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    couloir: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    terrasse: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    cuisine: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    sole: ['Selectioner', [selectionerValidator()]],
    eaux: ['Selectioner', [selectionerValidator()]],
    // starts: ['Selectioner', [selectionerValidator()]],
    sale_bain: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    sale_manger: ['', [ Validators.pattern(/^[0-9+]{1,}$/)]],
    garage: ['Selectioner', [selectionerValidator()]],
    condition: ['', []],
    partner: ['', []],
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
    region: ['Selectioner', [Validators.required, selectionerValidator()]],
    commune: ['Selectioner', [Validators.required, selectionerValidator()]],
    quartier: ['Selectioner', [Validators.required, selectionerValidator()]],
    etage: ['Selectioner', [selectionerValidator()]],
    mode_payement: ['Selectioner', [selectionerValidator()]],
    nb_day_free: ['Selectioner', [selectionerValidator()]],
    type: [0],
    secteur: ['', []],
    description: ['', [Validators.required]],
    fournisseur: ['0', []],
    delete: [0, []],
    active: [false ],
    property_id: ['',],
    from: ['',],
    ing: [false],
    images: ['', [ ]],
    video: ['',],
    user_id: ['',],
    slug_id: ['',],
  })

  onSubmit() {
    this.etatPadding = true;
    this.categorieRequired = false;
    this.regionRequired = false;
    this.communeRequired = false;
    this.quartierRequired = false;
    this.parkingRequired = false;
    this.meubleRequired = false;
    this.climatiseurRequired = false;
    this.courRequired = false;
    this.gardienRequired = false;
    this.chambreRequired = false;

    var ok = true;

    if (this.categorie.value == 'Selectioner') {
      this.categorieRequired = true;
      ok = false;
    } else {
      this.categorieRequired = false;
    }

    if (this.region.value == 'Selectioner') {
      this.regionRequired = true;
      ok = false;
    } else {
      this.regionRequired = false;
    }

    if (this.commune.value == 'Selectioner') {
      this.communeRequired = true;
      ok = false;
    } else {
      this.communeRequired = false;
    }

    if (this.quartier.value == 'Selectioner') {
      this.quartierRequired = true;
      ok = false;
    } else {
      this.quartierRequired = false;
    }

    if (this.parcking.value == 'Selectioner') {
      this.parkingRequired = true;
      ok = false;
    } else {
      this.parkingRequired = false;
    }

    if (this.meuble.value == 'Selectioner') {
      this.meubleRequired = true;
      ok = false;
    } else {
      this.meubleRequired = false;
    }

    if (this.climatiseur.value == 'Selectioner') {
      this.climatiseurRequired = true;
      ok = false;
    } else {
      this.climatiseurRequired = false;
    }

    if (this.gardien.value == 'Selectioner') {
      this.gardienRequired = true;
      ok = false;
    } else {
      this.gardienRequired = false;
    }

    if (this.cour.value == 'Selectioner') {
      this.courRequired = true;
      ok = false;
    } else {
      this.courRequired = false;
    }

    if (this.etage.value == 'Selectioner') {
      this.etageRequired = true;
      ok = false;
    } else {
      this.etageRequired = false;
    }

    if (this.sole.value == 'Selectioner') {
      this.soleRequired = true;
      ok = false;
    } else {
      this.soleRequired = false;
    }

    if (this.nivauxEtage.value == 'Selectioner' && this.etage.value == '1') {
      this.nivauxEtageRequired = true;
      ok = false;
    } else {
      this.nivauxEtageRequired = false;
    }
    
    if (this.avance.value == 'Selectioner') {
      this.avanceRequired = true;
      ok = false;
    } else {
      this.avanceRequired = false;
    }
    
    if (this.periode.value == 'Selectioner' && this.avance.value == '1') {
      this.periodeRequired = true;
      ok = false;
    } else {
      this.periodeRequired = false;
    }

    if (this.temps.value == 'Selectioner' && this.avance.value == '1') {
      this.tempsRequired = true;
      ok = false;
    } else {
      this.tempsRequired = false;
    }

    if (this.chambre.value == '') {
      this.chambreRequired = true;
      ok = false;
    } else {
      this.chambreRequired = false;
    }

    if (this.prix.value == '') {
      this.prixRequired = true;
      ok = false;
    } else {
      this.prixRequired = false;
    }

    if (!ok) {
      return;
    }

    this.user_id.setValue(this.userService.getUserDetails()._id);
    this.slug_id.setValue(this.userService.getUserDetails().slug);
    this.property_id.setValue(property_id_piyole);
    
    const formData = new FormData();
    
    for(let img of this.multiplesImages){
      formData.append('files', img);
    }

    this.postService.upload(formData).subscribe(res => {
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

      this.postService.addPost(this.controlForm.value).subscribe(res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Post ajouté!',
          showConfirmButton: false,
          timer: 2000
        })
        this.router.navigate(['posts/dashboard'])
      });
    });
  }

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

  eventChangeCommune(event: any){
    this.select_commune = true;
    this.quartierFileters = [];
    var commune = event.target.value;

    this.quartierFileters = this.quartiers.filter(resp => {
      return resp.commune == commune;
    })
  }

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

  onBack(){
    this.location.back();
  }
}
