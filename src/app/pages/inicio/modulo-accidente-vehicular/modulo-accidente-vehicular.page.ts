import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { ReportVehicular } from "src/app/models/report.model";
import { MapService } from "src/app/services/map.service";

import { CameraService } from "src/app/services/camera.service";
import { ReportService } from "src/app/services/report.service";
import { PermissionsService } from "src/app/services/permissions.service";
import { FirestoreService } from "src/app/services/firestore.service";
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Component({
  selector: "app-modulo-accidente-vehicular",
  templateUrl: "./modulo-accidente-vehicular.page.html",
  styleUrls: ["./modulo-accidente-vehicular.page.scss"],
})
export class ModuloAccidenteVehicularPage implements OnInit {
  photo: string; // FIXME Quizas borrar en html, conservado para evitar posible break
  locationSaved = false;
  photoTaken = false;

  public formVehicular: ReportVehicular = {
    module: "Accidente Vehicular",
    coordinate: [0, 0],
    photo: "",
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
    private firestoreService: FirestoreService,
    private afAuth: AngularFireAuth // TODO: Conjunto de lo que estamos probando
  ) {
    this.reportService.formData = this.formVehicular;
  }

  //TODO: ESTO FUNCIONA
  async ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.formVehicular.userEmail = user.email;
      } else {
        console.error("Usuario no autenticado.");
        // Redirigir a la página de inicio de sesión si es necesario
        this.navController.navigateForward("/login");
      }
    });
  }

  /*
  async ngOnInit() {
    try {
      const email = await this.firestoreService.getUserEmail();
      console.log("Correo obtenido: ", email);
      if (email) {
        this.formVehicular.userEmail = email;
        console.log(
          "Correo asignado a formVehicular: ",
          this.formVehicular.userEmail
        );
      } else {
        console.error("No se pudo obtener el correo del usuario.");
      }
    } catch (error) {
      console.error("Error al obtener el correo del usuario:", error);
    }
  }*/

  public async takePhoto() {
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

    //Lamamos al metodo takePhoto() del servicio de la camara para tomar una foto
    const photo = await this.cameraService.takePhoto();
    //Verificamos si la foto obtenida es valida (no es nula)
    if (photo) {
      //Si la foto es valida, la asignamos a la variable 'photo' del componente
      this.formVehicular.photo = photo;
    } else {
      //Si la foto es nula, mostramos un mensaje de error en la consola
      console.error("La foto es nula o no valida.");
    }
  }

  public updateCount() {
    var textarea = document.getElementById(
      "area_descripcion"
    ) as HTMLTextAreaElement;
    var count = document.getElementById("charCount");
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

  ///////////////
  public async goToLocationPage() {
    // Verificar los permisos antes de navegar a la página de ubicación
    const hasPermission =
      await this.permissionsService.checkLocationPermissions();
    if (hasPermission) {
      // Si los permisos están concedidos, navega a la página de ubicación
      this.navController.navigateForward("/inicio/location");
      this.locationSaved = true;
    } else {
      console.error(
        "active los permisos desde la configuracion de su dispositivo"
      );
    }
  }
  ///////////////////
  // Enviar formulario
  public validateForm(): void {
    if (this.isFormValid()) {
      // Realiza las validaciones exclusivas de este módulo si es necesario
      this.reportService.validateForm(true); // Enviar formulario al servicio
    } else {
      console.error("Por favor, complete todos los campos requeridos.");
    }
  }
}
