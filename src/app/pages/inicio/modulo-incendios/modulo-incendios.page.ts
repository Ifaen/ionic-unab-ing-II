import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Coordinate } from "ol/coordinate";
import { ReportIncendio } from "src/app/models/report.model";
import { MapService } from "src/app/services/map.service";
import { ReportService } from "src/app/services/report.service";

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
    knowsGrifo: true,
    descriptionGrifo: "",
    description: "",
  };
  constructor(
    private reportService: ReportService,
    private navController: NavController
  ) {
    this.reportService.formData = this.formIncendio;
  }

  ngOnInit() {}

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
