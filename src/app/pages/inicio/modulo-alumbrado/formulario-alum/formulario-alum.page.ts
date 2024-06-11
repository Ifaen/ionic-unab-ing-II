import { Component, OnInit } from "@angular/core";
import { ModalController, NavController, ToastController } from "@ionic/angular";
import { Router, NavigationEnd } from "@angular/router";
import { ReportAlumbrado } from "src/app/models/report.model";
import { CameraService } from "src/app/services/camera.service";
import { ReportService } from "src/app/services/report.service";
import { PermissionsService } from "src/app/services/permissions.service";

@Component({
  selector: "app-formulario-alum",
  templateUrl: "./formulario-alum.page.html",
  styleUrls: ["./formulario-alum.page.scss"],
})
export class FormularioAlumPage implements OnInit {
  photoTaken: boolean = false;
  locationSaved: boolean = false;
  formAlumbrado: ReportAlumbrado = {
    module: "alumbrado",
    coordinate: [0, 0],
    photo: "", // Link de la foto
    date: null,
    typeIncident: "",
    description: "",
  };

  //TODO se agrego una variable para los errores
  errorsMessages: string[] = []; // Array de cadenas

  constructor(
    private cameraService: CameraService,
    private toastController: ToastController,
    private reportService: ReportService,
    private navController: NavController,
    private modalController: ModalController,
    private permissionsService: PermissionsService,
    private router: Router
  ) {
    this.reportService.formData = this.formAlumbrado;
    this.subscribeToNavigationEvents();
  }

  async ngOnInit() {}

  async takePhoto() {
    if (!this.formAlumbrado.typeIncident) {
      const toast = await this.toastController.create({
        message: "Por favor, selecciona un título antes de seleccionar la foto.",
        duration: 2000, // Duración de la notificación en milisegundos
        position: "bottom", // Posición de la notificación
      });
      toast.present();
      console.error("Por favor, seleccione una opción antes de tomar una foto.");
      return; // Salimos de la función si no hay una opción seleccionada
    }

    // Verificar permisos de la cámara antes de tomar la foto
    const hasPermission = await this.permissionsService.checkCameraPermissions();
    if (!hasPermission) {
      const granted = await this.permissionsService.requestCameraPermissions();
      if (!granted) {
        alert("Permiso de cámara no concedido. Por favor, habilítalo en la configuración.");
        return;
      }
    }

    const photo = await this.cameraService.takePhoto();
    if (photo) {
        this.formAlumbrado.photo = photo;
    } else {
      console.error("La foto es nula o no válida.");
    }  
  }

  public async goToLocationPage() {
    const hasPermission = await this.permissionsService.checkLocationPermissions();
    if (hasPermission) {
      this.navController.navigateForward("/inicio/location");
    }else{
      console.error("active los permisos desde la configuracion de su dispositivo")
     }
  }

  public validateForm(): void {
    let isValid = true;
    this.errorsMessages = []; // Resetear errores

    if (!this.formAlumbrado.typeIncident) {
      isValid = false;
      this.errorsMessages.push("El título es obligatorio.");
    }

    if (!this.formAlumbrado.photo) {
      isValid = false;
      this.errorsMessages.push("La foto es obligatoria.");
    }

    if (
      !this.formAlumbrado.coordinate ||
      (this.formAlumbrado.coordinate[0] === 0 &&
        this.formAlumbrado.coordinate[1] === 0)
    ) {
      isValid = false;
      this.errorsMessages.push("La ubicación es obligatoria.");
    }

    if (isValid) {
      this.errorsMessages = [];
      this.reportService.validateForm(isValid); // Enviar formulario a servicio
    }
  }

  private subscribeToNavigationEvents() {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === "/inicio/modulo-alumbrado/formulario-alum") {
          const showToast = localStorage.getItem("showLocationSelectedToast");
          if (showToast === "true") {
            localStorage.removeItem("showLocationSelectedToast");
            const toast = await this.toastController.create({
              message: "La ubicación ya fue seleccionada.",
              duration: 2000,
              position: "bottom",
            });
            toast.present();
          }
        }
      }
    });
  }

  public updateCount() {
    var textarea = document.getElementById(
      "area_descripcion"
    ) as HTMLTextAreaElement;
    var count = document.getElementById("charCount");
    count.innerText = textarea.value.length + " / 200";
  }
}
