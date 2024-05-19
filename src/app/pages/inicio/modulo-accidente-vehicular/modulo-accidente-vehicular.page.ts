import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ReportVehicular } from "src/app/models/report.model";
import { CameraService } from "src/app/services/camera.service";
import { ReportService } from "src/app/services/report.service";

@Component({
  selector: "app-modulo-accidente-vehicular",
  templateUrl: "./modulo-accidente-vehicular.page.html",
  styleUrls: ["./modulo-accidente-vehicular.page.scss"],
})
export class ModuloAccidenteVehicularPage implements OnInit {
  photo: string;
  locationSaved = false;
  photoTaken = false;
  
  public formVehicular: ReportVehicular = {
    module: "accidente-vehicular",
    coordinate: [0, 0],
    photo: "",
    date: null,
    typeIncident: "",
    description: "",
    address: "",
  };

  constructor(
    private cameraService: CameraService,
    private reportService: ReportService,
    private navController: NavController
  ) {
    this.reportService.formData = this.formVehicular;
  }

  ngOnInit() {}

  public async takePhoto() {
    const photo = await this.cameraService.takePhoto();
    if (photo) {
      this.formVehicular.photo = photo;
    } else {
      console.error("La foto es nula o no válida.");
    }
  }

  public updateCount() {
    const textarea = document.getElementById(
      "area_descripcion"
    ) as HTMLTextAreaElement;
    const count = document.getElementById("charCount");
    count.innerText = textarea.value.length + " / 200";
  }

  public isFormValid(): boolean {
    // Verifica si todos los campos necesarios están llenos
    return (
      this.formVehicular.typeIncident &&
      this.formVehicular.description &&
      this.formVehicular.address &&
      /* otros campos necesarios */
      true
    );
  }

  public goToLocationPage() {
    this.navController.navigateForward("/inicio/location");
    this.locationSaved = true;
  }

  public validateForm(): void {
    if (this.isFormValid()) {
      // Realiza las validaciones exclusivas de este módulo si es necesario
      this.reportService.validateForm(true); // Enviar formulario al servicio
    } else {
      console.error("Por favor, complete todos los campos requeridos.");
    }
  }
}

