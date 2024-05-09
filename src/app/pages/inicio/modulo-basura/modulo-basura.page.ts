import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { FormBasura } from "src/app/models/formsReport.model";
import { CameraService } from "src/app/services/photo.service";
import { ReportFormService } from "src/app/services/reportForm.service";

@Component({
  selector: "app-modulo-basura",
  templateUrl: "./modulo-basura.page.html",
  styleUrls: ["./modulo-basura.page.scss"],
})
export class ModuloBasuraPage {
  /**
   * @deprecated
   */
  capturedImg: string;
  formBasura: FormBasura = {
    module: "basura",
    coordinate: [0, 0],
    photo: "", // Link de la foto
    date: new Date(),
    typeIncident: "",
    description: "",
  };

  constructor(
    private cameraService: CameraService,
    private reportFormService: ReportFormService,
    private navController: NavController
  ) {
    this.reportFormService.formData = this.formBasura;
  }

  ngOnInit() {}

  async executeImageCapture() {
    try {
      const photo = await this.cameraService.takePhoto();
      if (photo) {
        //this.capturedImg = photo;
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
  public async sendForm() {
    let isValid = true;
    // TODO Validaciones exclusivas de este modulo

    isValid = await this.reportFormService.sendForm(isValid); // Enviar formulario a servicio

    if (isValid) {
      console.log("Data added successfully");
      this.navController.navigateRoot("/inicio/home");
    } else {
      console.log("Failed to add data");
    }
  }
}
