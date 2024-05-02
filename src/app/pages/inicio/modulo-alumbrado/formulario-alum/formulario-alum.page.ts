import { Component, OnInit } from '@angular/core';
import { CameraService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-formulario-alum',
  templateUrl: './formulario-alum.page.html',
  styleUrls: ['./formulario-alum.page.scss'],
})
export class FormularioAlumPage implements OnInit {

  selectedOption: string;
  description: string;
  photo: string;
  locationCoords: {lat: number, lng: number};

  constructor(
    //private afDB: AngularFireDatabase,
    //private camera: Camera,
    //private modalController: ModalController
    private cameraService: CameraService
  ) { }

  ngOnInit() {
  }

  async takePhoto() {
    // Verificamos si se ha seleccionado una opción antes de permitir tomar la foto, para esto debe estar el titulo seleccionado
    if (!this.selectedOption) {
      console.error('Por favor, seleccione una opción antes de tomar una foto.');
      return; // Salimos de la función si no hay una opción seleccionada
    }
    //Lamamos al metodo takePhoto() del servicio de la camara para tomar una foto
    const photo = await this.cameraService.takePhoto();
    //Verificamos si la foto obtenida es valida (no es nula)
    if (photo) {
      //Si la foto es valida, la asignamos a la variable 'photo' del componente
      this.photo = photo;
    } else {
      //Si la foto es nula, mostramos un mensaje de error en la consola
      console.error('La foto es nula o no valida.');
    }
  }

}
