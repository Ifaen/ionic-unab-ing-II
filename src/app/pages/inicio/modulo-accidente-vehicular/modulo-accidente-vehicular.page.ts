import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { FormVehicular } from "src/app/models/formsReport.model";
import { MapService } from "src/app/services/map.service";

import { CameraService } from "src/app/services/photo.service";
import { ReportFormService } from "src/app/services/reportForm.service";

@Component({
  selector: "app-modulo-accidente-vehicular",
  templateUrl: "./modulo-accidente-vehicular.page.html",
  styleUrls: ["./modulo-accidente-vehicular.page.scss"],
})
export class ModuloAccidenteVehicularPage implements OnInit {
  photo: string; // FIXME Quizas borrar en html, conservado para evitar posible break

  formVehicular: FormVehicular = {
    module: "accidente-vehicular",
    coordinate: [0, 0],
    photo: "",
    date: new Date(),
    typeIncident: "",
    description: "",
  };

  constructor(
    //private afDB: AngularFireDatabase,
    //private camera: Camera,
    //private modalController: ModalController
    private cameraService: CameraService,
    private mapService: MapService,
    private reportFormService: ReportFormService
  ) {}

  ngOnInit() {}

  async takePhoto() {
    //Lamamos al metodo takePhoto() del servicio de la camara para tomar una foto
    const photo = await this.cameraService.takePhoto();
    //Verificamos si la foto obtenida es valida (no es nula)
    if (photo) {
      //Si la foto es valida, la asignamos a la variable 'photo' del componente
      this.formVehicular.photo = photo;
    } else {
      //Si la foto es nula, mostramos un mensaje de error en la consola
      console.error("La foto es nula o no valida.");
    }
  }

  updateCount() {
    var textarea = document.getElementById(
      "area_descripcion"
    ) as HTMLTextAreaElement;
    var count = document.getElementById("charCount");
    count.innerText = textarea.value.length + " / 200";
  }

  // Ir a seleccionar localizacion, enviando la informacion del formulario en un servicio
  goToLocationPage() {
    this.mapService.goToLocationPage(this.formVehicular);
  }

  // Enviar formulario
  sendForm() {
    let isValid = true;
    // TODO Validaciones exclusivas de este modulo

    isValid = this.reportFormService.sendForm(this.formVehicular, isValid); // Enviar formulario a servicio

    if (!isValid) {
      return;
    }
    // TODO ir al /inicio/home
  }
}
