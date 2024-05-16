import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { ReportBasura } from "src/app/models/report.model";
import { CameraService } from "src/app/services/camera.service";
import { ReportService } from "src/app/services/report.service";

@Component({
  selector: "app-modulo-basura",
  templateUrl: "./modulo-basura.page.html",
  styleUrls: ["./modulo-basura.page.scss"],
})
export class ModuloBasuraPage {
  formBasura: ReportBasura = {
    module: "basura",
    coordinate: [0, 0],
    photo: "", // Link de la foto
    date: new Date(),
    typeIncident: "",
    description: "",
  };

  constructor(
    private cameraService: CameraService,
    private reportService: ReportService,
    private navController: NavController
  ) {
    this.reportService.formData = this.formBasura;
  }

  ngOnInit() {}

  async executeImageCapture() {
    try {
      const photo = await this.cameraService.takePhoto();
      if (photo) {
        this.formBasura.photo = photo;
      } else {
        console.error("Error: Captured image is null or invalid.");
      }
    } catch (error) {
      console.error("Error: Unable to capture image.", error);
    }
  }

  refreshCharacterLimit() {
    let inputField = document.querySelector(
      "#input_description"
    ) as HTMLTextAreaElement;
    let limitDisplay = document.querySelector("#limitDisplay");

    let currentLength = inputField.value.length;
    let maxLength = 200;

    limitDisplay.textContent = `${currentLength} of ${maxLength} characters used`;
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
