import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Coordinate } from "ol/coordinate";
import { FormIncendio } from "src/app/models/formsReport.model";
import { MapService } from "src/app/services/map.service";
import { ReportFormService } from "src/app/services/reportForm.service";

@Component({
  selector: "app-modulo-incendios",
  templateUrl: "./modulo-incendios.page.html",
  styleUrls: ["./modulo-incendios.page.scss"],
})
export class ModuloIncendiosPage implements OnInit {
  public formIncendio: FormIncendio = {
    module: "incendios",
    coordinate: [0, 0],
    photo: "",
    date: new Date(),
    typeIncident: "",
    knowsGrifo: true,
    descriptionGrifo: "",
    description: "",
  };
  constructor(
    private reportFormService: ReportFormService,
    private navController: NavController
  ) {
    this.reportFormService.formData = this.formIncendio;
  }

  ngOnInit() {}

  public goToLocationPage() {
    this.navController.navigateForward("/inicio/location");
  }

  // Enviar formulario
  public sendForm() {
    let isValid = true;
    // TODO Validaciones exclusivas de este modulo

    isValid = this.reportFormService.sendForm(isValid); // Enviar formulario a servicio

    if (!isValid) {
      return;
    }
    // TODO ir al /inicio/home
  }
}
