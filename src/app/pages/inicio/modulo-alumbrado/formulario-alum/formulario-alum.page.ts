import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { FormAlumbrado } from "src/app/models/formsReport.model";
import { MapService } from "src/app/services/map.service";
import { CameraService } from "src/app/services/photo.service";
import { ReportFormService } from "src/app/services/reportForm.service";
import { ToastController } from "@ionic/angular";
import { Storage } from "@ionic/storage-angular";


@Component({
  selector: "app-formulario-alum",
  templateUrl: "./formulario-alum.page.html",
  styleUrls: ["./formulario-alum.page.scss"],
})
export class FormularioAlumPage implements OnInit {

  /**
   * @deprecated reemplazados por interface de formAlumbrado
   */
  selectedTittle: string;
  description: string;
  photo: string;
  locationCoords: { lat: number; lng: number };

  formAlumbrado: FormAlumbrado = {
    module: "alumbrado",
    coordinate: [0, 0],
    photo: "", // Link de la foto
    date: new Date(),
    typeIncident: "",
    description: "",
  };

  constructor(
    //private afDB: AngularFireDatabase,
    //private camera: Camera,
    //private modalController: ModalController
    private cameraService: CameraService,
    private storage: Storage,
    private toastController: ToastController,
    private reportFormService: ReportFormService,
    private navController: NavController
  ) {
    this.reportFormService.formData = this.formAlumbrado;
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async takePhoto() {
    // Verificamos si se ha seleccionado una opción antes de permitir tomar la foto, para esto debe estar el titulo seleccionado
    if (!this.selectedTittle) {
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
    //Lamamos al metodo takePhoto() del servicio de la camara para tomar una foto
    const photo = await this.cameraService.takePhoto();
    //Verificamos si la foto obtenida es valida (no es nula)
    if (photo) {
      //Si la foto es valida, la asignamos a la variable 'photo' del componente
      this.photo = photo;
    } else {
      //Si la foto es nula, mostramos un mensaje de error en la consola
      console.error("La foto es nula o no valida.");
    }
  }


  async saveItem() {
    // Guardar los datos localmente
    const newItem = {
      title: this.selectedTittle,
      description: this.description,
      image: this.photo,
      location: this.locationCoords,
    };

    // Guardar el nuevo item en el almacenamiento local
    await this.storage.set("item", newItem);
    console.log("Item almacenado localmente:", newItem);

    // Limpiar los campos después de guardar
    this.selectedTittle = "";
    this.description = "";
    this.photo = "";
    this.locationCoords = null;
   }

  public goToLocationPage() {
    this.navController.navigateForward("/inicio/location");
  }

  // Enviar formulario
  public sendForm() {
    let isValid = true;
    // TODO Validaciones exclusivas de este modulo

    isValid = this.reportFormService.sendForm(isValid); // Enviar formulario a servicio

    if (!isValid) {
      return;
    }
    // TODO ir al /inicio/home

  }
}
