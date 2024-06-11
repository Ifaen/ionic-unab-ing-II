import { Component, Input, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ReportIncendio } from "src/app/models/report.model";
import { CameraService } from "src/app/services/camera.service";
import { ReportService } from "src/app/services/report.service";
import { PermissionsService } from "src/app/services/permissions.service";
import { MapService } from "src/app/services/map.service";
import { Coordinate } from "ol/coordinate";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-modulo-incendios",
  templateUrl: "./modulo-incendios.page.html",
  styleUrls: ["./modulo-incendios.page.scss"],
})
export class ModuloIncendiosPage implements OnInit {
  photoTaken: boolean = false;
  locationSaved: boolean = false;
  public formIncendio: ReportIncendio = {
    module: "incendios",
    coordinate: [0, 0],
    photo: "",
    date: null,
    typeIncident: "",
    knowsGrifo: false,
    descriptionGrifo: "",
    description: "",
  };

  constructor(
    private cameraService: CameraService,
    private reportService: ReportService,
    private navController: NavController,
    private permissionsService: PermissionsService
  ) {
    this.reportService.formData = this.formIncendio;
  }

  ngOnInit() {}

  public async goToLocationPage() {
     // Verificar los permisos antes de navegar a la página de ubicación
     const hasPermission = await this.permissionsService.checkLocationPermissions();
     if (hasPermission) {
       // Si los permisos están concedidos, navega a la página de ubicación
       this.navController.navigateForward("/inicio/location");
     }else{
      console.error("active los permisos desde la configuracion de su dispositivo")
     }
  }
  async takePhoto() {

    const hasPermission = await this.permissionsService.checkCameraPermissions();
    if (!hasPermission) {
      const granted = await this.permissionsService.requestCameraPermissions();
      if (!granted) {
        alert("Permiso de cámara no concedido. Por favor, habilítalo en la configuración.");
        return;
      }
    }

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
  public validateForm(): void {
    let isValid = true;
    // TODO Validaciones exclusivas de este modulo

    this.reportService.validateForm(isValid); // Enviar formulario a servicio
  }
  public updateCount() {
    var textarea = document.getElementById(
      "area_descripcion"
    ) as HTMLTextAreaElement;
    var count = document.getElementById("charCount");
    count.innerText = textarea.value.length + " / 200";
  }
}
