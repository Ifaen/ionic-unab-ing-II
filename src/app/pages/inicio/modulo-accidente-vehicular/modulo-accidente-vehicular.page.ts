import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { ReportVehicular } from "src/app/models/report.model";
import { MapService } from "src/app/services/map.service";

import { CameraService } from "src/app/services/photo.service";
import { ReportService } from "src/app/services/report.service";

@Component({
  selector: "app-modulo-accidente-vehicular",
  templateUrl: "./modulo-accidente-vehicular.page.html",
  styleUrls: ["./modulo-accidente-vehicular.page.scss"],
})
export class ModuloAccidenteVehicularPage implements OnInit {
  photo: string; // FIXME Quizas borrar en html, conservado para evitar posible break

  public formVehicular: ReportVehicular = {
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
    private reportService: ReportService,
    private navController: NavController
  ) {
    this.reportService.formData = this.formVehicular;
  }

  ngOnInit() {}

  public async takePhoto() {
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

  public updateCount() {
    var textarea = document.getElementById(
      "area_descripcion"
    ) as HTMLTextAreaElement;
    var count = document.getElementById("charCount");
    count.innerText = textarea.value.length + " / 200";
  }

  public goToLocationPage() {
    this.navController.navigateForward("/inicio/location");
  }

  // Enviar formulario
  public sendForm(): void {
    let isValid = true;
    // TODO Validaciones exclusivas de este modulo

    this.reportService.sendForm(isValid); // Enviar formulario a servicio
  }
}
