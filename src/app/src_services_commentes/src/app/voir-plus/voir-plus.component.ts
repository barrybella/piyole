import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-voir-plus',
  templateUrl: './voir-plus.component.html',
  styleUrls: ['./voir-plus.component.css']
})
export class VoirPlusComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<VoirPlusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
  }

}
