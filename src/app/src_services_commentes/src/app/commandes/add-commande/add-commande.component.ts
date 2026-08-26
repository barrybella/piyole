import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { CommandeService } from 'src/app/services/commande.service';
import { PostService } from 'src/app/services/post.service';
import { PrintService } from 'src/app/services/print.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-commande',
  templateUrl: './add-commande.component.html',
  styleUrls: ['./add-commande.component.css']
})
export class AddCommandeComponent implements OnInit {
  user?: User;
  shop?: any;
  quantity_event?: number = 0;
  total_price_event?: number = 0;

  etatPadding: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddCommandeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private router: Router, private postService: PostService, private userService: UserService, public print: PrintService, private snackBar: SnackBarService, private commandeService: CommandeService) { }

  ngOnInit() {
  }

  controlForm = this.fb.group({
    adress: ['', [Validators.required]],
    desc: [''],
    montant: [''],
    baskets: ['']
  });


  onSubmit(){
    this.montant?.setValue(this.data.total_price);
    this.baskets?.setValue(this.data.baskets);
    this.etatPadding = true;
   console.log("CONTROL FORM ", this.data.baskets);
   
    
    this.commandeService.addCommande(this.controlForm.value).subscribe(res => {
      this.snackBar.openSnackBar("Produit Ajouter au panier!!!", "Fermer");
      this.dialogRef.close();
      this.router.navigate(['commandes/order-list']);
    })
  }


  get montant(){
    return this.controlForm.get('montant');
  }

  get desc(){
    return this.controlForm.get('desc');
  }

  get adress(){
    return this.controlForm.get('adress');
  }

  get baskets(){
    return this.controlForm.get('baskets');
  }
}
