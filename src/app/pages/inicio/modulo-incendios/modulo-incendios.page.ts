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
    }
  }

  async takePhoto() {

    const hasPermission = await this.permissionsService.checkCameraPermissions();// guardamos en "hasPermission" el estado actual del permiso
    if (hasPermission) {//verificamos si el permiso fue concedido 
      const photo = await this.cameraService.takePhoto();//Llamamos al metodo takePhoto() del servicio de la camara para tomar una foto
      if (photo) {//Verificamos si la foto obtenida es valida (no es nula)
        this.formIncendio.photo = photo; //Si la foto es valida, la asignamos a la variable 'photo' del componente
      } else {
        console.error('La foto es nula o no válida.');//Si la foto es nula, mostramos un mensaje de error en la consola
      }
    } else {
      console.error('El permiso de la camara no fue otorgado');//si no fue otorgada, sale el mensaje
    }
    
  }
  // Enviar formulario
  public validateForm(): void {
    let isValid = true;
    // TODO Validaciones exclusivas de este modulo

    if (this.formIncendio.photo == "") {
      // TODO Validacion
      console.log("No hay foto");
    }

    this.reportService.validateForm(isValid); // Enviar formulario a servicio
  }
}
