import { Component, Input, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ReportIncendio } from "src/app/models/report.model";
import { CameraService } from "src/app/services/camera.service";
import { ReportService } from "src/app/services/report.service";
import { PermissionsService } from "src/app/services/permissions.service";
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Component({
  selector: "app-modulo-incendios",
  templateUrl: "./modulo-incendios.page.html",
  styleUrls: ["./modulo-incendios.page.scss"],
})
export class ModuloIncendiosPage implements OnInit {
  public formIncendio: ReportIncendio = {
    module: "Incendios",
    coordinate: [0, 0],
    photo: "",
    date: null,
    typeIncident: "",
    knowsGrifo: false,
    descriptionGrifo: "",
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
    this.reportService.formData = this.formIncendio;
  }

  //ngOnInit() {}

  //Nos permite saber si el usuario esta Autentificado
  async ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.formIncendio.userEmail = user.email;
      } else {
        console.error("Usuario no autenticado.");
        // Redirigir a la página de inicio de sesión si es necesario
        this.navController.navigateForward("/login");
      }
    });
  }

  public async goToLocationPage() {
    // Verificar los permisos antes de navegar a la página de ubicación
    const hasPermission =
      await this.permissionsService.checkLocationPermissions();
    if (hasPermission) {
      // Si los permisos están concedidos, navega a la página de ubicación
      this.navController.navigateForward("/inicio/location");
    } else {
      console.error(
        "active los permisos desde la configuracion de su dispositivo"
      );
    }
  }

  async takePhoto() {
    const hasPermission =
      await this.permissionsService.checkCameraPermissions();
    if (!hasPermission) {
      const granted = await this.permissionsService.requestCameraPermissions();
      if (!granted) {
        alert(
          "Permiso de cámara no concedido. Por favor, habilítalo en la configuración."
        );
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
    const { typeIncident, coordinate, photo } = this.formIncendio;

    if (!typeIncident || !coordinate || coordinate.length === 0 || !photo) {
      alert(
        "Por favor, complete todos los campos obligatorios antes de enviar el reporte."
      );
      return;
    }

    let isValid = true;

    this.reportService.validateForm(isValid); // Enviar formulario a servicio
  }
}
