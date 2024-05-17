import { Injectable } from "@angular/core";
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
import { Timestamp } from "firebase/firestore";
import firebase from "firebase/compat";

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

  public async sendForm(isValid: boolean): Promise<void> {
    const loading = await this.loadingController.create({
      spinner: "crescent",
    });

    await loading.present();

    try {
      if (this.formData.module == "") {
        // TODO Mostrar popup con error
        console.log("No modulo"); // TODO Borrar esto
        isValid = false;
      }
      if (
        this.formData.coordinate[0] == 0 ||
        this.formData.coordinate[1] == 0
      ) {
        // TODO Mostrar popup con error
        console.log("No coordenadas"); // TODO Borrar esto
        isValid = false;
      }

      if (this.formData.photo == "") {
        // TODO Mostrar popup con error
        console.log("No imagen"); // TODO Borrar esto
        isValid = false;
      } else {
        // Enviar foto a firebase storage y almacenar el url resultante
        this.formData.photo = await this.cameraService.sendPhoto(
          this.formData.photo
        );
      }

      if (isValid) {
        // Agregar fecha y hora de envio del reporte
        this.formData.date = new Date().toLocaleString("es-ES", {
          timeZone: "America/Santiago",
        });

        // Enviar formulario a collection reportes
        let result = new Promise<boolean>((resolve, reject) => {
          this.firestore
            .collection("reportes")
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
    } catch (error) {
      console.log(error);
    } finally {
      await loading.dismiss(); // Ocultar loading
    }
  }

  public async getReports(): Promise<Report[]> {
    const reports: Report[] = [];
    try {
      const snapshot = await this.firestore
        .collection("reportes")
        .get()
        .toPromise();
      snapshot.forEach((doc) => {
        reports.push(doc.data() as Report);
      });
      return reports;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
