import { Injectable } from "@angular/core";
import {
  ReportAlumbrado,
  ReportBasura,
  ReportIncendio,
  Report,
  ReportVehicular,
} from "../models/report.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { NavController } from "@ionic/angular";
import { CameraService } from "./photo.service";

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
    private photoService: CameraService
  ) {}

  public async sendForm(isValid: boolean): Promise<void> {
    if (this.formData.module == "") {
      // TODO Mostrar popup con error
      console.log("No modulo"); // TODO Borrar esto
      isValid = false;
    }
    if (this.formData.coordinate[0] == 0 || this.formData.coordinate[1] == 0) {
      // TODO Mostrar popup con error
      console.log("No coordenadas"); // TODO Borrar esto
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Enviar foto a firebase storage y almacenar el url resultante
    this.formData.photo = await this.photoService.sendPhoto(
      this.formData.photo
    );

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

    if (result) this.navController.navigateRoot("/inicio/home");
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
      console.error("Error getting reports:", error);
      throw error;
    }
  }
}
