import { SnackBarService } from './../../services/snack-bar.service';
import { Post } from './../../interfaces/post';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.css']
})
export class AddVideoComponent implements OnInit {
  post?: Post;
  title?: any;
  button?: any;
  etatPadding: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private postService: PostService, private _snackBar: SnackBarService, private router: Router) { }

  ngOnInit() {
    this.post = this.data.post;
    this.title = this.data.title;
    this.button = this.data.button;
  }

  controlForm = this.fb.group({
    video: ['', [Validators.required]],
  });


  onSubmit(){
    this._snackBar.uploadVideoOpenSnackBar("Telechargement de la vidéo en cours.. Veuillez patientez...", "");
    this.etatPadding = true; 
    const formDataVideo = new FormData();
    formDataVideo.append('file', this.fileDataVideo);

     this.postService.uploadVideo(formDataVideo).subscribe(resp => {
      this.video?.setValue(resp.path);
      this.postService.updateVideo(this.post?._id, this.controlForm.value).subscribe(res => {
        Swal.fire("Modifié", "Video modifier avec succès", "success");
        this.dialogRef.close();
        this.router.navigate(['posts/dashboard']);
      })
    })
   
  }

  fileDataVideo?: any;

  fileVideoProgress(event){
    this.fileDataVideo = <File>event.target.files[0];

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.controlForm.get('video').setValue(file);
      // console.log("VIDEOS FILE ", this.video.value);
    }
  }

  get video(){
    return this.controlForm.get('video');
  }

}
