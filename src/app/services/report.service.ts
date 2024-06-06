import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  ReportAlumbrado,
  ReportBasura,
  ReportIncendio,
  Report,
  ReportVehicular,
} from "../models/report.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { LoadingController, NavController } from "@ionic/angular";
import { CameraService } from "./camera.service";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  public formData:
    | ReportAlumbrado
    | ReportBasura
    | ReportIncendio
    | ReportVehicular;

  constructor(
    private firestore: AngularFirestore,
    private navController: NavController,
    private loadingController: LoadingController,
    private cameraService: CameraService
  ) {}

  //obtener los cambios en la coleccion en la base de datos
  public getReportsUpdates(): Observable<any> {
    return this.firestore.collection('reports').snapshotChanges();
  }

  public async validateForm(isValid: boolean): Promise<void> {
    const loading = await this.loadingController.create({
      spinner: "crescent",
    });

    await loading.present();

    try {
      if (this.formData.module == "") {
        // TODO Mostrar popup con error
        isValid = false;
      }
      if (
        this.formData.coordinate[0] == 0 ||
        this.formData.coordinate[1] == 0
      ) {
        // TODO Mostrar popup con error
        isValid = false;
      }

      // Si tiene una photo, enviarla al storage de firebase y almacenar el url resultante
      if (this.formData.photo != "") {
        this.formData.photo = await this.cameraService.sendPhoto(
          this.formData.photo
        );
      }

      if (isValid) {
        this.sendForm();
      }
    } catch (error) {
      console.log(error);
    } finally {
      await loading.dismiss(); // Ocultar loading
    }
  }

  // Enviar formulario a backend
  sendForm() {
    // Agregar fecha y hora de envio del reporte
    this.formData.date = new Date().toLocaleString("es-ES", {
      timeZone: "America/Santiago",
    });

    // Enviar formulario a collection reportes
    let result = new Promise<boolean>((resolve, reject) => {
      this.firestore
        .collection("reports")
        .add(this.formData)
        .then((response) => {
          console.log(response.id);
          resolve(true);
        })
        .catch((error) => {
          console.error(error);
          resolve(false);
        });
    });

    if (result) this.navController.navigateRoot("/inicio/home"); // Volver al inicio
  }

  public async getReports(): Promise<Report[]> {
    const reports: Report[] = [];

    try {
      const snapshot = await this.firestore
        .collection("reports")
        .get()
        .toPromise();

      snapshot.forEach((doc) => {
        const report = doc.data() as Report; // Obtener la data del documento
        report.id = doc.id; // Obtener la id creada por firebase
        reports.push(report); // Agregarlo a la lista
      });

      return reports;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public getIcon(module: string): string {
    switch (module) {
      case "alumbrado":
        return "assets/icon/icon-modulo-1.png";
      case "accidente-vehicular":
        return "assets/icon/icon-modulo-2.png";
      case "incendios":
        return "assets/icon/icon-modulo-3.png";
      case "basura":
        return "assets/icon/icon-modulo-4.png";
      default:
        console.log(module);
        return "";
    }
  }
}
