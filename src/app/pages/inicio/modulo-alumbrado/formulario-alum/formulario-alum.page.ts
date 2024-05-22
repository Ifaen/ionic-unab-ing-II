import { Component, OnInit } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { ReportAlumbrado } from "src/app/models/report.model";
import { CameraService } from "src/app/services/camera.service";
import { ReportService } from "src/app/services/report.service";
import { ToastController } from "@ionic/angular";
import { NavigationEnd, Router } from "@angular/router";
import { PermissionsService } from "src/app/services/permissions.service";
//import { ConfirmationModalComponent } from "src/app/shared/component/confirmation-modal/confirmation-modal.component";

@Component({
  selector: "app-formulario-alum",
  templateUrl: "./formulario-alum.page.html",
  styleUrls: ["./formulario-alum.page.scss"],
})
export class FormularioAlumPage implements OnInit {
  formAlumbrado: ReportAlumbrado = {
    module: "alumbrado",
    coordinate: [0, 0],
    photo: "", // Link de la foto
    date: null,
    typeIncident: "",
    description: "",
  };

  //TODO se agrego una variable para los errores
  errorsMessages: string[] = []; //Array de Cadenas

  constructor(
    private cameraService: CameraService,
    private toastController: ToastController,
    private reportService: ReportService,
    private navController: NavController,
    private modalController: ModalController, // TODO No fucniona de momento
    private permissionsService: PermissionsService,
    private router: Router //TODO se debe de agregar para utilizar la redireccion del toast luego de que escogo la ubicacion
  ) {
    this.reportService.formData = this.formAlumbrado;
    this.subscribeToNavigationEvents();
  }

  async ngOnInit() {}

  async takePhoto() {

    const hasPermission = await this.permissionsService.checkCameraPermissions();// guardamos en "hasPermission" el estado actual del permiso
    if (hasPermission) {//verificamos si el permiso fue concedido 
      const photo = await this.cameraService.takePhoto();//Llamamos al metodo takePhoto() del servicio de la camara para tomar una foto
      if (photo) {//Verificamos si la foto obtenida es valida (no es nula)
        this.formAlumbrado.photo = photo; //Si la foto es valida, la asignamos a la variable 'photo' del componente
      } else {
        console.error('La foto es nula o no válida.');//Si la foto es nula, mostramos un mensaje de error en la consola
      }
    } else {
      console.error('El permiso de la camara no fue otorgado');//si no fue otorgada, sale el mensaje
    }


    // Verificamos si se ha seleccionado una opción antes de permitir tomar la foto, para esto debe estar el titulo seleccionado
    if (!this.formAlumbrado.typeIncident) {
      const toast = await this.toastController.create({
        message:
          "Por favor, selecciona un título antes de seleccionar la foto.",
        duration: 2000, //Duracion de la notificacion en milisegundos
        position: "bottom", //Posicion de la notificacion
      });
      toast.present();
      console.error(
        "Por favor, seleccione una opción antes de tomar una foto."
      );
      return; // Salimos de la función si no hay una opción seleccionada
    }

  }

  public goToLocationPage() {
    this.navController.navigateForward("/inicio/location");
  }

  // //TODO PROBANDO MODAL DE CONFIRMACION --> NO FUNCIONA
  // public async confirmationModal() {
  //   const modal = await this.modalController.create({
  //     component: ConfirmationModalComponent,
  //     cssClass: "my-custom-modal-css",
  //   });
  //   console.log("estoy aqui");
  //   await modal.present();
  //   const { data } = await modal.onWillDismiss();
  //   if (data && data.confirm) {
  //     this.sendForm();
  //   }
  // }

  // Enviar formulario
  public validateForm(): void {
    let isValid = true;
    // TODO Validaciones exclusivas de este modulo
    this.errorsMessages = []; // Resetear errores

    // Validacion del Titulo
    if (!this.formAlumbrado.typeIncident) {
      isValid = false;
      this.errorsMessages.push("El título es obligatorio.");
    }

    // Validacion de la Foto
    if (!this.formAlumbrado.photo) {
      isValid = false;
      this.errorsMessages.push("La foto es obligatoria.");
    }

    // Validacion de la ubicacion
    if (
      !this.formAlumbrado.coordinate ||
      (this.formAlumbrado.coordinate[0] === 0 &&
        this.formAlumbrado.coordinate[1] === 0)
    ) {
      isValid = false;
      this.errorsMessages.push("La ubicación es obligatoria.");
    }

    // Si no hay errores, enviar el formulario
    if (isValid) {
      this.errorsMessages = [];
      this.reportService.validateForm(isValid); // Enviar formulario a servicio
    }
  }

  //TODO Probando Notificacion --> FUNCIONA
  private subscribeToNavigationEvents() {
    //Suscribirse a los eventos de navegacion
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        //Verificar si la URL actual es la del formulario
        if (this.router.url === "/inicio/modulo-alumbrado/formulario-alum") {
          //Comprobar si se debe mostrar el Toast
          const showToast = localStorage.getItem("showLocationSelectedToast");
          if (showToast == "true") {
            localStorage.removeItem("showLocationSelectedToast");
            const toast = await this.toastController.create({
              message: "La ubicación ya fue seleccionada.",
              duration: 2000, // Duracion de la notificacion en milisegundos
              position: "bottom", // Posicion de la notificacion
            });
            toast.present();
          }
        }
      }
    });
  }
}

