import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ReportVehicular } from "src/app/models/report.model";
import { CameraService } from "src/app/services/camera.service";
import { ReportService } from "src/app/services/report.service";
import { PermissionsService } from "src/app/services/permissions.service";

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
  };

  constructor(
    private cameraService: CameraService,
    private reportService: ReportService,
    private navController: NavController,
    private permissionsService: PermissionsService
  ) {
    this.reportService.formData = this.formVehicular;
  }

  ngOnInit() {}

  public async takePhoto() {

    const hasPermission = await this.permissionsService.checkCameraPermissions();// guardamos en "hasPermission" el estado actual del permiso
    if (hasPermission) {//verificamos si el permiso fue concedido 
      const photo = await this.cameraService.takePhoto();//Llamamos al metodo takePhoto() del servicio de la camara para tomar una foto
      if (photo) {//Verificamos si la foto obtenida es valida (no es nula)
        this.formVehicular.photo = photo; //Si la foto es valida, la asignamos a la variable 'photo' del componente
      } else {
        console.error('La foto es nula o no válida.');//Si la foto es nula, mostramos un mensaje de error en la consola
      }
    } else {
      console.error('El permiso de la camara no fue otorgado');//si no fue otorgada, sale el mensaje
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
      this.locationSaved
      /* otros campos necesarios */
    );
  }

  public async goToLocationPage() {
    // Verificar los permisos antes de navegar a la página de ubicación
    const hasPermission = await this.permissionsService.checkLocationPermissions();
    if (hasPermission) {
      // Si los permisos están concedidos, navega a la página de ubicación
      this.navController.navigateForward("/inicio/location");
      this.locationSaved = true;
    }
    
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

