import { Component } from "@angular/core";
import { CameraService } from "src/app/services/photo.service";

@Component({
  selector: 'app-modulo-basura',
  templateUrl: './modulo-basura.page.html',
  styleUrls: ['./modulo-basura.page.scss'],
})
export class ModuloBasuraPage {
  
  constructor(private cameraService: CameraService) {}

  async takePhoto() {
    try {
      const photo = await this.cameraService.takePhoto();
      if (photo) {
        // Aquí puedes hacer lo que quieras con la foto, por ejemplo, mostrarla en un elemento de imagen en tu página
        const imageElement = document.getElementById('imagen') as HTMLInputElement; // Asegúrate de tener un elemento con el id 'imagen' en tu HTML
        imageElement.value = photo;
      } else {
        // Manejar el caso en el que la foto no se captura correctamente
      }
    } catch (error) {
      // Manejar el error
    }
  }

  ngOnInit() {

  }
}