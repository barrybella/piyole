import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

// in bytes, compress images larger than 1MB
const fileSizeMax = 1 * 1024 * 1024
// in pixels, compress images have the width or height larger than 1024px
const widthHeightMax = 1024
const defaultWidthHeightRatio = 1
const defaultQualityRatio = 0.7

// Service de compression d'images côté client, avant envoi vers le serveur/S3.
// Redimensionne et réduit la qualité des images trop grandes (> 1 Mo ou > 1024px)
// pour économiser de la bande passante et accélérer les téléversements.
@Injectable({
  providedIn: 'root'
})
export class CompressImageService {
  // Compresse une image : la lit en mémoire, la redessine sur un canvas HTML à une
  // taille et une qualité réduites si nécessaire, puis retourne le nouveau fichier
  // compressé de façon asynchrone (Observable).
  compress(file: File): Observable<File> {
    const imageType = file.type || 'image/jpeg'
    const reader = new FileReader()
    reader.readAsDataURL(file)

    return Observable.create(observer => {
      // This event is triggered each time the reading operation is successfully completed.
      reader.onload = ev => {
        // Create an html image element
        const img = this.createImage(ev)
        // Choose the side (width or height) that longer than the other
        const imgWH = img.width > img.height ? img.width : img.height

        // Determines the ratios to compress the image
        let withHeightRatio = (imgWH > widthHeightMax) ? widthHeightMax/imgWH : defaultWidthHeightRatio
        let qualityRatio = (file.size > fileSizeMax) ? fileSizeMax/file.size : defaultQualityRatio

        // Fires immediately after the browser loads the object
        img.onload = () => { 
          const elem = document.createElement('canvas')
          // resize width, height
          elem.width = img.width * withHeightRatio
          elem.height = img.height * withHeightRatio

          // elem.width = 3300
          // elem.height = 2200

          const ctx = <CanvasRenderingContext2D>elem.getContext('2d')
          ctx.drawImage(img, 0, 0, elem.width, elem.height)
          ctx.canvas.toBlob(  
            // callback, called when blob created
            blob => { 
              observer.next(new File(
                [blob],
                file.name,
                {
                  type: imageType,
                  lastModified: Date.now(),
                }
              ))
            },
            imageType,
            qualityRatio, // reduce image quantity 
          )
        }
      }

      // Catch errors when reading file
      reader.onerror = error => observer.error(error)
    })
  }

  // Crée un élément Image HTML à partir du résultat de lecture du fichier (data URL).
  private createImage(ev) {
    let imageContent = ev.target.result
    const img = new Image()
    img.src = imageContent
    return img
  }
}