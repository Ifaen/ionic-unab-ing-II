import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { ReportBasura } from "src/app/models/report.model";
import { CameraService } from "src/app/services/camera.service";
import { ReportService } from "src/app/services/report.service";
import { PermissionsService } from "src/app/services/permissions.service";
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Component({
  selector: "app-modulo-basura",
  templateUrl: "./modulo-basura.page.html",
  styleUrls: ["./modulo-basura.page.scss"],
})
export class ModuloBasuraPage {
  LocationSelected = false; // Añade esta línea
  formBasura: ReportBasura = {
    module: "Basura",
    coordinate: [0, 0],
    photo: "", // Link de la foto
    date: null,
    typeIncident: "",
    description: "",
    userEmail: "",
  };

  constructor(
    private cameraService: CameraService,
    private reportService: ReportService,
    private navController: NavController,
    private permissionsService: PermissionsService,
    private afAuth: AngularFireAuth
  ) {
    this.reportService.formData = this.formBasura;
  }

  //ngOnInit() {}

  //Nos permite saber si el usuario esta Autentificado
  async ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.formBasura.userEmail = user.email;
      } else {
        console.error("Usuario no autenticado.");
        // Redirigir a la página de inicio de sesión si es necesario
        this.navController.navigateForward("/login");
      }
    });
  }

  public goToMapPage() {
    this.navController.navigateBack("/inicio/map");
  }

  async executeImageCapture() {
    try {
      // Verificar permisos de la cámara antes de tomar la foto
      const hasPermission =
        await this.permissionsService.checkCameraPermissions();
      if (!hasPermission) {
        const granted =
          await this.permissionsService.requestCameraPermissions();
        if (!granted) {
          alert(
            "Permiso de cámara no concedido. Por favor, habilítalo en la configuración."
          );
          return;
        }
      }

      // Intentar tomar la foto
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

  public async goToLocationPage() {
    // Verificar los permisos antes de navegar a la página de ubicación
    const hasPermission =
      await this.permissionsService.checkLocationPermissions();
    if (hasPermission) {
      // Si los permisos están concedidos, navega a la página de ubicación
      this.navController.navigateForward("/inicio/location");
      this.LocationSelected = true;
    } else {
      console.error(
        "active los permisos desde la configuracion de su dispositivo"
      );
    }
  }

  // Enviar formulario
  public validateForm(): void {
    let isValid = true;
    // TODO Validaciones exclusivas de este modulo

    this.reportService.validateForm(isValid); // Enviar formulario a servicio
  }
}
