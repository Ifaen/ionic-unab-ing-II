import { Component, Input, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ReportIncendio } from "src/app/models/report.model";
import { CameraService } from "src/app/services/camera.service";
import { ReportService } from "src/app/services/report.service";
import { MapService } from "src/app/services/map.service";
import { Coordinate } from "ol/coordinate";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-modulo-incendios",
  templateUrl: "./modulo-incendios.page.html",
  styleUrls: ["./modulo-incendios.page.scss"],
})
export class ModuloIncendiosPage implements OnInit {
  public formIncendio: ReportIncendio = {
    module: "incendios",
    coordinate: [0, 0],
    photo: "",
    date: new Date(),
    typeIncident: "",
    knowsGrifo: false,
    descriptionGrifo: "",
    description: "",
  };

  constructor(
    private cameraService: CameraService,
    private reportService: ReportService,
    private navController: NavController
  ) {
    this.reportService.formData = this.formIncendio;
  }

  ngOnInit() {}

  public goToLocationPage() {
    this.navController.navigateForward("/inicio/location");
  }
  async takePhoto() {
    //Llamamos al metodo takePhoto() del servicio de la camara para tomar una foto
    const photo = await this.cameraService.takePhoto();
    //Verificamos si la foto obtenida es valida (no es nula)
    if (photo) {
      //Si la foto es valida, la asignamos a la variable 'photo' del componente
      this.formIncendio.photo = photo;
    } else {
      //Si la foto es nula, mostramos un mensaje de error en la consola
      console.error("La foto es nula o no valida.");
    }
  }
  // Enviar formulario
  public sendForm(): void {
    let isValid = true;
    // TODO Validaciones exclusivas de este modulo

    // Imprimir el contenido del formulario en la consola
    console.log(this.formIncendio);

    // Enviar formulario a servicio
    this.reportService.sendForm(isValid);
  }
}