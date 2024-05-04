import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { CameraService } from "src/app/services/photo.service";

@Component({
  selector: "app-modulo-accidente-vehicular",
  templateUrl: "./modulo-accidente-vehicular.page.html",
  styleUrls: ["./modulo-accidente-vehicular.page.scss"],
})
export class ModuloAccidenteVehicularPage implements OnInit {
  selectedOption: string;
  description: string;
  photo: string;

  constructor(
    //private afDB: AngularFireDatabase,
    //private camera: Camera,
    //private modalController: ModalController
    private cameraService: CameraService
  ) { }

  ngOnInit() {
  }

  async takePhoto() {
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

  updateCount() {
    var textarea = document.getElementById(
      "area_descripcion"
    ) as HTMLTextAreaElement;
    var count = document.getElementById("charCount");
    count.innerText = textarea.value.length + " / 200";
  }

}
